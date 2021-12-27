import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'

const querySchema = Joi.object({
  id: Joi.string().required(),
})

export default validate({ query: querySchema }, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    await dbConnect()

    const id: string = req.query.id.toString()

    try {
      const order = await Order.findOne({ pid: id, platform: 'paypal' })

      res.status(200).json(order)
    } catch (err: any) {
      res.status(500).send({ code: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
})