import dbConnect from '@/lib/dbConnect'
import Cors from 'micro-cors'
import { NextApiRequest, NextApiResponse } from 'next'
import Order from '@/schemas/Order'
import axios from 'axios'

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://api.paypal.com'
    : 'https://api.sandbox.paypal.com'
}

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await dbConnect()

    const payload = {
      'auth_algo': req.headers['paypal-auth-algo'],
      'cert_url': req.headers['paypal-cert-url'],
      'transmission_id': req.headers['paypal-transmission-id'],
      'transmission_sig': req.headers['paypal-transmission-sig'],
      'transmission_time': req.headers['paypal-transmission-time'],
      'webhook_id': process.env.PAYPAL_WID,
      'webhook_event': req.body
    }
    const authHeader = `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CID}:${process.env.PAYPAL_CS}`).toString('base64')}`
    
    const verify = await axios.post(getBaseUrl() + '/v1/notifications/verify-webhook-signature', payload, { headers: { 'Authorization': authHeader } }).then(res => res.data)
    
    if(verify.verification_status !== 'SUCCESS') return res.status(400).send({ code: 400, message: 'the event did not pass the verification process' })
    
    const eventType = req.body.event_type
    const orderId = req.body.resource.supplementary_data?.related_ids?.order_id
    if(eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      try {
        await Order.findOneAndUpdate({ platform: "paypal", pid: orderId }, { $set: {
          status: "paid"
        } })
      } catch(err) {
        res.status(500).send({ code: 500, message: "Internal Server Error" })
      }
    } else {
      // send email
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
}

export default cors(webhookHandler as any)