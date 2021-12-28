import type { NextApiRequest, NextApiResponse } from 'next'
import client from '@/lib/paypal'
import paypal from '@paypal/checkout-server-sdk'
import Stripe from 'stripe'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'
import moment from 'moment-timezone'
import crypto from 'crypto'

const schema = Joi.object({
  cart: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    quantity: Joi.number().required(),
  })),
  shipping: Joi.string().required(),
})

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

export default validate({ body: schema }, async (req: NextApiRequest, res: NextApiResponse,) => {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }

  await dbConnect()

  const cartItems = await Promise.all(req.body.cart.map(async (i:any) => {
    const resPrice = await stripe.prices.retrieve(i.id)
    const resAmount = resPrice.unit_amount
    const resProduct = await stripe.products.retrieve(resPrice.product.toString())
    return { id: i.id, quantity: i.quantity, price: resAmount! / 100, name: resProduct.name }
  }))

  const shippingRatePrice = await (await stripe.shippingRates.retrieve(req.body.shipping)).fixed_amount?.amount || 0

  const priceArr = cartItems.map((p:any) => {
    return p.price * p.quantity
  })

  const totalPrice = priceArr.reduce((previousValue, currentValue) => previousValue + currentValue, 0)

  const payPalItems = cartItems.map((i:any) => {
    const { quantity, price, name } = i
    return { name: name, unit_amount: { currency_code: 'EUR', value: ( price * 0.81).toFixed(2).toString() }, quantity: quantity.toString(), category: 'PHYSICAL_GOODS' }
  })

  const PaypalClient = client()
  const request = new paypal.orders.OrdersCreateRequest()
  request.headers['Prefer'] = 'return=representation'
  request.requestBody({
    // @ts-ignore
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: ( totalPrice + (shippingRatePrice / 100) ).toString(),
          breakdown: {
            item_total: { currency_code: 'EUR', value: ( totalPrice * 0.81 ).toFixed(2).toString() },
            shipping: { currency_code: 'EUR', value: ( shippingRatePrice / 100 ).toString() },
            handling: { currency_code: 'EUR', value: '0' },
            tax_total: { currency_code: 'EUR', value: ( totalPrice * 0.19 ).toFixed(2).toString() },
            insurance: { currency_code: 'EUR', value: '0' },
            shipping_discount: { currency_code: 'EUR', value: '0' },
            discount: { currency_code: 'EUR', value: '0' }
          }
        },
        // @ts-ignore
        items: payPalItems
      },
    ],
    // @ts-ignore
    application_context: {
      locale: 'de-DE',
    },
  })
  const response = await PaypalClient.execute(request)
  if (response.statusCode !== 201) return res.status(500).send({ code: 500, message: 'Internal Server Error' })

  const dbItems = cartItems.map((i:any) => {
    const { id, quantity, price } = i
    return { id, quantity, price }
  })

  const orderNumber = (crypto.createHash('sha256').update(moment().toString()).digest('hex')).substring(0, 12)

  const order = new Order({
    platform: 'paypal',
    pid: response.result.id,
    order_number: orderNumber,
    purchased_items: dbItems,
    total_price: totalPrice + (shippingRatePrice / 100),
    shipping_rate: {
      id: req.body.shipping,
      price: shippingRatePrice / 100,
    },
    status: 'pending',
  })
  try {
    await order.save()
  } catch(err) {
    return res.status(500).send({ code: 500, message: 'Internal Server Error' })
  }

  res.status(200).json({ orderID: response.result.id })
})