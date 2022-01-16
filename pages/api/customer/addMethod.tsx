import dbConnect from "@/lib/dbConnect"
import User from "@/schemas/User"
import UserData from "@/schemas/UserData"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

export default async function AddMethod(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }

  const session = await getSession({ req })
  if(!session) return res.status(401).send({ code: 401, message: 'Unauthorized' })
  const email = session.user?.email

  await dbConnect()

  const user = await User.findOne({ email: email }).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })

  let userData = await UserData.findOne({ uid: user._id }).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })
  if(!userData) {
    const newData = new UserData({
      uid: user._id
    })
    try {
      userData = await newData.save()
    } catch(err) {
      return res.status(500).send({ code: 500, message: 'Internal Server Error' })
    }
  }

  let customer
  if(!userData.stripeCustomerID) {
    customer = await stripe.customers.create({ email: user.email, name: user.name })
    await UserData.updateOne({ uid: user._id }, { $set: { stripeCustomerID: customer.id } })
  } else {
    customer = await stripe.customers.retrieve(userData.stripeCustomerID)
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'setup',
    payment_method_types: [ 'card' ],
    success_url: `${req.headers.origin}/u/home?successfullyAddedPM=true`,
    cancel_url: req.body.cancelUrl ? req.headers.origin + req.body.cancelUrl : `${req.headers.origin}/u/home`,
    locale: 'de',
    customer: customer.id,
  }
  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)

  res.status(200).json(checkoutSession)
}