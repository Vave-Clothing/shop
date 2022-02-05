import type { NextApiRequest, NextApiResponse } from "next"
import Joi from "joi"
import validate from "@/lib/middlewares/validation"
import dbConnect from "@/lib/dbConnect"
import User from "@/schemas/User"

const querySchema = Joi.object({
  email: Joi.string().email().required(),
})

export default validate({ query: querySchema }, async ( req: NextApiRequest, res: NextApiResponse ) => {
  if(req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }
  
  const email = req.query.email
  await dbConnect()

  const user = await User.findOne({ email: email })
  if(!user) {
    return res.status(404).send({ code: 404, message: 'Not Found: This user does not exist' })
  }
  res.send({ id: user._id })
})