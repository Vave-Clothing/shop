import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    await dbConnect()

    const id: string = req.query.id.toString()

    try {
      const order = await Order.findOne({ pid: id, platform: 'paypal' })

      res.status(200).json(order)
    } catch (err: any) {
      res.status(500).json({ code: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
  }
}