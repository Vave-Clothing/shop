import { NextApiRequest, NextApiResponse } from 'next'
import startsWith from '@/lib/startsWith'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    res.status(405).end('Method Not Allowed')
  }
}