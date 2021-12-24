import type { NextApiRequest, NextApiResponse } from 'next'
import client from '@/lib/paypal'
import paypal from '@paypal/checkout-server-sdk'
import Stripe from 'stripe'
import dbConnect from '@/lib/dbConnect'
import Order from '@/schemas/Order'

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  await dbConnect()

  const cartItems = await Promise.all(Object.keys(req.body.cart).map(async (key) => {
    const { id, quantity } = req.body.cart[key]
    const resPrice = await (await stripe.prices.retrieve(id)).unit_amount
    return { id, quantity, price: resPrice! / 100 }
  }))

  const priceArr = cartItems.map((p) => {
    return p.price * p.quantity
  })

  const totalPrice = priceArr.reduce((previousValue, currentValue) => previousValue + currentValue, 0)

  const PaypalClient = client()
  const request = new paypal.orders.OrdersCreateRequest()
  request.headers['Prefer'] = 'return=representation'
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: totalPrice.toString(),
        },
      },
    ],
    application_context: {
      locale: 'de-DE',
    },
  })
  const response = await PaypalClient.execute(request)
  if (response.statusCode !== 201) return res.status(500).end('Internal Server Error')

  const order = new Order({
    platform: 'paypal',
    pid: response.result.id,
    purchased_items: cartItems,
    total_price: totalPrice,
    status: 'pending',
    date: new Date()
  })
  try {
    await order.save()
  } catch(err) {
    return res.status(500).end('Internal Server Error')
  }

  res.json({ orderID: response.result.id })
}