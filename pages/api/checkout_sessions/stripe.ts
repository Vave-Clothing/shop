import { NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'
import Stripe from 'stripe'

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
    try {
      const cartItems = req.body.cart.map((i:any) => {
        return { price: i.id, quantity: i.quantity }
      })

      const shippingRateId: string = req.body.shipping

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        payment_method_types: [ 'card', 'sepa_debit', 'giropay', 'sofort', 'klarna' ],
        line_items: cartItems,
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

      res.status(200).json(checkoutSession)
    } catch (err: any) {
      res.status(500).json({ code: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
})