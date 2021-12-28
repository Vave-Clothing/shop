import type { NextApiRequest, NextApiResponse } from 'next'
import client from '@/lib/paypal'
import paypal from '@paypal/checkout-server-sdk'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'

const schema = Joi.object({
  orderID: Joi.string().required(),
})

export default validate({ body: schema }, async (req: NextApiRequest, res: NextApiResponse,) => {
  if(req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
  
  await dbConnect()

  const { orderID } = req.body
  const PaypalClient = client()
  const request = new paypal.orders.OrdersCaptureRequest(orderID)
  // @ts-ignore
  request.requestBody({})
  const response = await PaypalClient.execute(request)
  if(!response) return res.status(500).send({ code: 500, message: 'Internal Server Error' })
  if(response.result.status !== 'COMPLETED') return res.status(403).send({ code: 403, message: 'Payment does not contain completed status' })

  const paymentStatus = () => {
    switch (response.result.status) {
      case 'COMPLETED':
        return 'paid'
      case 'APPROVED':
        return 'processing'
      case 'VOIDED':
        return 'failed'
      case 'SAVED':
        return 'processing'
      case 'PAYER_ACTION_REQUIRED':
        return 'processing'
      case 'CREATED':
        return 'pending'
      default:
        return 'pending'
    }
  }

  await Order.updateOne({ platform: 'paypal', pid: orderID }, { $set: {
    email: response.result.payer.email_address,
    shipping_address: {
      name: response.result.purchase_units[0].shipping.name.full_name,
      line1: response.result.purchase_units[0].shipping.address.address_line_1,
      line2: response.result.purchase_units[0].shipping.address.address_line_2 || '',
      zip: Number(response.result.purchase_units[0].shipping.address.postal_code),
      city: response.result.purchase_units[0].shipping.address.admin_area_2,
      state: response.result.purchase_units[0].shipping.address.admin_area_1,
      country: response.result.purchase_units[0].shipping.address.country_code,
    },
    status: paymentStatus(),
  }})

  res.status(200).json({ ...response.result })
})