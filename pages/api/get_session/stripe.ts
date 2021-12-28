import { NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'
import blurEmailAddress from '@/lib/blurEmailAddress'

const querySchema = Joi.object({
  id: Joi.string().required(),
})

export default validate({ query: querySchema }, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    await dbConnect()

    const id: string = req.query.id.toString()

    try {
      const order = await Order.findOne({ pid: id, platform: 'stripe' })

      const data = {
        email: blurEmailAddress(order.email),
        platform: order.platform,
        pid: order.pid,
        purchased_items: order.purchased_items,
        total_price: order.total_price,
        shipping_rate: order.shipping_rate,
        status: order.status,
      }

      res.status(200).json(data)
    } catch (err: any) {
      res.status(500).json({ code: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
})