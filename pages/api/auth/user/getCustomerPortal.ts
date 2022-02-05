import dbConnect from "@/lib/dbConnect"
import validate from "@/lib/middlewares/validation"
import User from "@/schemas/User"
import UserData from "@/schemas/UserData"
import { getSession } from 'next-auth/react'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27'
})

export default validate({}, async (req, res) => {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }

  const session = await getSession({ req })
  if(!session) return res.status(401).send({ code: 401, message: 'Unauthorized' })
  const email = session?.user?.email

  await dbConnect()

  const user = await User.findOne({ email: email })
  const userData = await UserData.findOne({ uid: user._id })
  if(userData.stripeCustomerID) {
    const portalSession = await stripe.billingPortal.sessions.create({ customer: userData.stripeCustomerID, return_url: req.headers['origin'] + '/u/edit' })
    return res.send(portalSession)
  }

  res.send({ noCustomer: true })
})