import type { NextApiRequest, NextApiResponse } from 'next'
import client from '@/lib/paypal'
import paypal from '@paypal/checkout-server-sdk'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if(req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    return res.status(405).end('Method Not Allowed')
  }
  
  await dbConnect()

  const { orderID } = req.body
  const PaypalClient = client()
  const request = new paypal.orders.OrdersCaptureRequest(orderID)
  // @ts-ignore
  request.requestBody({})
  const response = await PaypalClient.execute(request)
  if(!response) return res.status(500).end('Internal Server Error')
  if(response.result.status !== 'COMPLETED') return res.status(403).end({ code: 403, message: 'Payment does not contain completed status' })

  await Order.updateOne({ platform: 'paypal', pid: orderID }, { $set: {
    status: 'paid'
  }})

  res.json({ ...response.result })
}