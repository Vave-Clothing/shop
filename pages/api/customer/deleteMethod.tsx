import dbConnect from "@/lib/dbConnect"
import User from "@/schemas/User"
import UserData from "@/schemas/UserData"
import Joi from "joi"
import { getSession } from "next-auth/react"
import Stripe from "stripe"
import validate from "@/lib/middlewares/validation"

const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: '2020-08-27',
})

const schema = Joi.object({
  id: Joi.string().required(),
})

export default validate({ body: schema }, async (req, res) => {
  if(req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }

  const session = await getSession({ req })
  if(!session) return res.status(401).send({ code: 401, message: 'Unauthorized' })
  const email = session.user?.email

  await dbConnect()

  const user = await User.findOne({ email: email }).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })

  const userData = await UserData.findOne({ uid: user._id }).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })
  if(!userData || !userData.stripeCustomerID) return res.status(403).send({ code: 403, message: 'Forbidden' })

  const methods = await (await stripe.customers.listPaymentMethods(userData.stripeCustomerID, { type: "card" })).data
  const findMethod = methods.find(m => m.id === req.body['id'])
  if(!findMethod) return res.status(403).send({ code: 403, message: 'Forbidden' })

  await stripe.paymentMethods.detach(req.body['id'])

  res.status(200).send({ success: true })
})