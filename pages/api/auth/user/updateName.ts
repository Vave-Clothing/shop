import dbConnect from "@/lib/dbConnect"
import validate from "@/lib/middlewares/validation"
import User from "@/schemas/User"
import UserData from "@/schemas/UserData"
import Joi from "joi"
import { getSession } from 'next-auth/react'
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27'
})

const schema = Joi.object({
  name: Joi.string().regex(/^(\w{1,}\s){1,}\w{1,}$/).required(),
})

export default validate({ body: schema }, async (req, res) => {
  if(req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }

  const session = await getSession({ req })
  if(!session) return res.status(401).send({ code: 401, message: 'Unauthorized' })
  const email = session?.user?.email

  await dbConnect()

  await User.updateOne({ email: email }, { $set: { name: req.body['name'] } })

  const user = await User.findOne({ email: email })
  const userData = await UserData.findOne({ uid: user._id })
  if(userData.stripeCustomerID) {
    await stripe.customers.update(userData.stripeCustomerID, { name: req.body['name'] })
  }

  res.send({ success: true })
})