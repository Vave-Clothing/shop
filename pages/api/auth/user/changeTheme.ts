import dbConnect from "@/lib/dbConnect"
import validate from "@/lib/middlewares/validation"
import User from "@/schemas/User"
import UserData from "@/schemas/UserData"
import Joi from "joi"
import { getSession } from 'next-auth/react'

const schema = Joi.object({
  theme: Joi.string().regex(/^(dark)|(light)|(system)$/).required(),
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

  const user = await User.findOne({ email: email })
  await UserData.updateOne({ uid: user._id }, { $set: { theme: req.body.theme } }, { upsert: true })

  res.send({ success: true })
})