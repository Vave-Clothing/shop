import type { NextApiRequest, NextApiResponse } from 'next'
import client from '@/lib/paypal'
import paypal from '@paypal/checkout-server-sdk'
import Stripe from 'stripe'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  await dbConnect()

  const cartItems = await Promise.all(Object.keys(req.body.cart).map(async (key) => {
    const { id, quantity } = req.body.cart[key]
    const resPrice = await stripe.prices.retrieve(id)
    const resAmount = resPrice.unit_amount
    const resProduct = await stripe.products.retrieve(resPrice.product.toString())
    return { id, quantity, price: resAmount! / 100, name: resProduct.name }
  }))

  const shippingRatePrice = await (await stripe.shippingRates.retrieve(req.body.shipping)).fixed_amount?.amount || 0

  const priceArr = cartItems.map((p) => {
    return p.price * p.quantity
  })

  const totalPrice = priceArr.reduce((previousValue, currentValue) => previousValue + currentValue, 0)

  const payPalItems = cartItems.map(i => {
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
  if (response.statusCode !== 201) return res.status(500).end('Internal Server Error')

  const dbItems = cartItems.map(i => {
    const { id, quantity, price } = i
    return { id, quantity, price }
  })

  const order = new Order({
    platform: 'paypal',
    pid: response.result.id,
    purchased_items: dbItems,
    total_price: totalPrice,
    email: 'john.doe@example.com',
    shipping_address: {
      name: 'John Doe',
      line1: 'Platz der Republik 1',
      zip: 11011,
      city: 'Berlin',
      country: 'germany',
    },
    status: 'pending',
    date: new Date()
  })
  try {
    await order.save()
  } catch(err) {
    return res.status(500).end('Internal Server Error')
  }

  res.json({ orderID: response.result.id })
}