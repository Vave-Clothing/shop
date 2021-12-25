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

  const country = () => {
    switch (response.result.purchase_units[0].shipping.address.country_code) {
      case 'DE':
        return 'germany'
      case 'AT':
        return 'austria'
      case 'CH':
        return 'switzerland'
      default:
        break
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
      country: country(),
    },
    status: 'paid',
  }})

  res.json({ ...response.result })
}