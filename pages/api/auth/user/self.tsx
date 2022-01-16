import type { NextApiRequest, NextApiResponse } from "next"
import validate from "@/lib/middlewares/validation"
import dbConnect from "@/lib/dbConnect"
import User from "@/schemas/User"
import { getSession } from "next-auth/react"
import Joi from "joi"
import WebauthnCredential from "@/schemas/WebauthnCredential"
import Order from "@/schemas/Order"
import UserData from "@/schemas/UserData"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

const querySchema = Joi.object({
  scopes: Joi.string(),
})

export default validate({ query: querySchema }, async ( req: NextApiRequest, res: NextApiResponse ) => {
  if(req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
  
  const queryScopes = req.query['scopes']
  const rawScopes = queryScopes ? queryScopes.toString().split(' ') : []
  const scopes = () => {
    const self = rawScopes.find(s => s === 'self')
    const security = rawScopes.find(s => s === 'security')
    const orders = rawScopes.find(s => s === 'orders')
    const paymentMethods = rawScopes.find(s => s === 'paymentmethods')

    return {
      self: self ? true : false,
      security: security ? true : false,
      orders: orders ? true : false,
      paymentMethods: paymentMethods ? true : false,
    }
  }

  const session = await getSession({ req })
  if(!session) return res.status(401).send({ code: 401, message: 'Unauthorized' })
  const email = session?.user?.email

  await dbConnect()

  const user = await User.findOne({ email: email }).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })
  const userObject = {
    id: user._id,
    email: user.email,
    email_verified: user.email_verified,
    name: user.name,
  }

  let securityObject
  if(scopes().security === true) {
    const security = await WebauthnCredential.find({ userID: userObject.id }).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })
    securityObject = security ? security.map((c: any) => {
      return {
        id: c._id,
        credentialID: c.credentialID,
        credentialName: c.credentialName,
        userID: c.userID,
        transports: c.transports,
        createdAt: c.createdAt,
      }
    }) : []
  }

  let orderObject
  if(scopes().orders === true) {
    await Order.updateMany({ email: email, user_id: '' }, { $set: { user_id: userObject.id } })

    const orders = await Order.find({ user_id: userObject.id })
    const order = orders.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    orderObject = order ? order.map((o:any) => {
      return {
        id: o._id,
        platform: o.platform,
        order_number: o.order_number,
        purchased_items: o.pruchased_items,
        total_price: o.total_price,
        email: o.email,
        shipping_address: o.shipping_address,
        shipping_rate: o.shipping_rate,
        status: o.status,
        shipping_status: o.shipping_status,
        stripeReceipt: o.stripeReceipt,
      }
    }) : []
  }

  let paymentMethodObject
  if(scopes().paymentMethods === true) {
    const userData = await UserData.findOne({ uid: user._id })
    const methods = await (await stripe.customers.listPaymentMethods(userData.stripeCustomerID, { type: "card" })).data
    const cards = methods.map((m:any) => {
      return {
        id: m.id,
        name: m.billing_details.name,
        exp_month: m.card.exp_month,
        exp_year: m.card.exp_year,
        last4: m.card.last4,
        brand: m.card.brand,
      }
    })
    paymentMethodObject = cards
  }

  const data = {
    self: userObject,
    security: securityObject,
    orders: orderObject,
    paymentMethods: paymentMethodObject,
  }
  res.send(data)
})