import { NextApiRequest, NextApiResponse } from 'next'
import startsWith from '@/lib/startsWith'
import Stripe from 'stripe'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'

const querySchema = Joi.object({
  id: Joi.string().required(),
})

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

export default validate({ query: querySchema }, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const id: string = req.query.id.toString()

    try {
      if(!startsWith(id, 'cs_')) {
        throw Error('incorrect session id')
      }

      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(id)

      res.status(200).json(checkoutSession)
    } catch (err: any) {
      res.status(500).json({ code: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
})