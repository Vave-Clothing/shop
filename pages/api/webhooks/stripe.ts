import dbConnect from '@/lib/dbConnect'
import { buffer } from 'micro'
import Cors from 'micro-cors'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import Order from '@/schemas/Order'

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
    await dbConnect()

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

    let eventType
    let paymentStatus

    switch (event.type) {
      case 'checkout.session.completed':
        eventType = event.data.object as Stripe.Checkout.Session
        paymentStatus = eventType.payment_status === 'paid' ? 'paid' : 'processing'
        await Order.updateOne({ platform: 'stripe', pid: eventType.id }, { $set: {
          status: paymentStatus,
          email: eventType.customer_details?.email,
          shipping_address: {
            name: eventType.shipping?.name,
            line1: eventType.shipping?.address?.line1,
            line2: eventType.shipping?.address?.line2,
            zip: eventType.shipping?.address?.postal_code,
            city: eventType.shipping?.address?.city,
            country: eventType.shipping?.address?.country,
          }
        } })
        break
      case 'checkout.session.async_payment_succeeded':
        eventType = event.data.object as Stripe.Checkout.Session
        paymentStatus = eventType.payment_status === 'paid' ? 'paid' : 'processing'
        await Order.updateOne({ platform: 'stripe', pid: eventType.id }, { $set: {
          status: paymentStatus
        } })
        // TODO: Notify user about processing status
        break
      case 'checkout.session.async_payment_failed':
        eventType = event.data.object as Stripe.Checkout.Session
        await Order.updateOne({ platform: 'stripe', pid: eventType.id }, { $set: {
          status: 'failed'
        } })
        // TODO: Notify user about failing payment
        break
      case 'charge.dispute.created':
        eventType = event.data.object as Stripe.Charge
        console.log(`💵 Charge id: ${eventType.id} (disputed)`)
        // TODO: Notify employees about disputed charge
        break
      case 'charge.dispute.funds_withdrawn':
        eventType = event.data.object as Stripe.Charge
        await Order.updateOne({ platform: 'stripe', pid: eventType.id }, { $set: {
          status: 'disputed'
        } })
        break
      case 'charge.succeeded':
        eventType = event.data.object as Stripe.Charge
        console.log(`💵 Receipt: ${eventType.receipt_url}`)
        // TODO: Send customer reciept
        break
      default:
        // console.warn(`🤷 Unhandled event type: ${event.type}`)
        break
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
}

export default cors(webhookHandler as any)