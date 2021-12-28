import { NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'
import Stripe from 'stripe'
import Order from '@/schemas/Order'
import dbConnect from '@/lib/dbConnect'
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

export default validate({ body: schema }, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await dbConnect()

    try {
      const cartItems = await Promise.all(req.body.cart.map(async (i:any) => {
        const resPrice = await stripe.prices.retrieve(i.id)
        const resAmount = resPrice.unit_amount
        return { price: i.id, quantity: i.quantity, amount: resAmount! / 100 }
      }))

      const shippingRateId: string = req.body.shipping

      const stripeItems = cartItems.map((i:any) => {
        return { price: i.price, quantity: i.quantity }
      })

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        payment_method_types: [ 'card', 'sepa_debit', 'giropay', 'sofort', 'klarna' ],
        line_items: stripeItems,
        success_url: `${req.headers.origin}/success?pid={CHECKOUT_SESSION_ID}&platform=stripe`,
        cancel_url: req.body.cancelUrl ? req.headers.origin + req.body.cancelUrl : `${req.headers.origin}/checkout/payment`,
        shipping_address_collection: {
          allowed_countries: [ 'DE', 'CH', 'AT' ],
        },
        shipping_rates: [ shippingRateId ],
        locale: 'de',
        submit_type: 'pay',
      }
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)

      const dbItems = cartItems.map((i:any) => {
        return { id: i.price, quantity: i.quantity, price: i.amount }
      })

      const shippingRateAmount = await (await stripe.shippingRates.retrieve(shippingRateId)).fixed_amount?.amount || 0

      const orderNumber = (crypto.createHash('sha256').update(moment().toString()).digest('hex')).substring(0, 12)

      const order = new Order({
        platform: 'stripe',
        pid: checkoutSession.id,
        order_number: orderNumber,
        purchased_items: dbItems,
        total_price: checkoutSession.amount_total! / 100,
        shipping_rate: {
          id: shippingRateId,
          price: shippingRateAmount / 100
        },
        status: 'pending',
        stripePI: checkoutSession.payment_intent
      })

      try {
        await order.save()
      } catch(err) {
        return res.status(500).send({ code: 500, message: 'Internal Server Error' })
      }

      res.status(200).json(checkoutSession)
    } catch (err: any) {
      res.status(500).json({ code: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
})