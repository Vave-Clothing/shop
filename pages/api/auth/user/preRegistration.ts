import type { NextApiRequest, NextApiResponse } from "next"
import Joi from "joi"
import validate from "@/lib/middlewares/validation"
import dbConnect from "@/lib/dbConnect"
import RegistrationData from "@/schemas/RegistrationData"
import User from "@/schemas/User"

const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().regex(/^(\w{1,}\s){1,}\w{1,}$/).required(),
})

export default validate({ body: schema }, async ( req: NextApiRequest, res: NextApiResponse ) => {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
  
  await dbConnect()

  const user = await User.findOne({ email: req.body.email })
  if(user) {
    return res.status(404).send({ code: 400, message: 'User already exists' })
  }

  const data = new RegistrationData({
    email: req.body.email,
    name: req.body.name,
  })
  await data.save()

  res.send({ success: true })
})