import { buffer } from 'micro'
import Cors from 'micro-cors'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

const webhookSecret: string = process.env.STRIPE_WS!

export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`)
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`)
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge
      console.log(`💵 Charge id: ${charge.id}`)
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      // const fetchedSession = await stripe.checkout.sessions.retrieve(session.id, { expand: [ 'line_items' ] })
      console.log(`💻 Session id: ${session.id}`)
    } else {
      console.warn(`🤷 Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default cors(webhookHandler as any)