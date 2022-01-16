import type { NextApiRequest, NextApiResponse } from "next"
import validate from "@/lib/middlewares/validation"
import dbConnect from "@/lib/dbConnect"
import Joi from "joi"
import Order from "@/schemas/Order"
import blurEmailAddress from "@/lib/blurEmailAddress"
import crypto from "crypto"

const querySchema = Joi.object({
  orderNumber: Joi.string().required(),
  postalCode: Joi.number(),
  accessHash: Joi.string(),
})

export default validate({ query: querySchema }, async ( req: NextApiRequest, res: NextApiResponse ) => {
  if(req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
  await dbConnect()

  const rawOrder = await Order.findOne({ order_number: req.query.orderNumber })
  if(!rawOrder) return res.status(404).send({ code: 404, message: 'This Order cannot be found' })

  let order = {
    email: blurEmailAddress(rawOrder.email),
    platform: rawOrder.platform,
    pid: rawOrder.pid,
    order_number: rawOrder.order_number,
    purchased_items: rawOrder.purchased_items,
    total_price: rawOrder.total_price,
    shipping_rate: rawOrder.shipping_rate,
    status: rawOrder.status,
    shipping_status: rawOrder.shipping_status,
    user_id: rawOrder.user_id,
  }

  if(Number(req.query['postalCode']) === rawOrder.shipping_address.zip) {
    order = {
      ...order,
      // @ts-ignore
      shipping_address: rawOrder.shipping_address,
      stripeReceipt: rawOrder.stripeReceipt,
    }
  }

  const generatedAccessHash = (crypto.createHash('sha256').update(`${order.user_id}:${process.env.STRIPE_SK}`).digest('hex')).substring(0, 16)
  if(req.query['accessHash']) {
    if(req.query['accessHash'].toString() === generatedAccessHash) {
      order = {
        ...order,
        // @ts-ignore
        shipping_address: rawOrder.shipping_address,
        stripeReceipt: rawOrder.stripeReceipt,
        email: rawOrder.email,
      }
    }
  }

  res.send(order)
})