import dbConnect from "@/lib/dbConnect"
import validate from "@/lib/middlewares/validation"
import User from "@/schemas/User"
import Joi from "joi"
import { getSession } from "next-auth/react"
import WebauthnCredential from '@/schemas/WebauthnCredential'

const schema = Joi.object({
  id: Joi.string().required()
})

export default validate({ body: schema }, async (req, res) => {
  if(req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
  }

  await dbConnect()

  const session = await getSession({ req })
  if(!session) return res.status(401).send({ code: 401, message: 'Unauthorized' })
  const user = await User.findOne({ email: session?.user?.email }).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })
  const userID = user._id
  const credential = await WebauthnCredential.findById(req.body['id']).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })
  if(credential.userID != userID) return res.status(403).send({ code: 403, message: 'Forbidden' })

  await WebauthnCredential.findByIdAndDelete(req.body['id']).catch(() => { return res.status(500).send({ code: 500, message: 'Internal Server Error' }) })

  res.send({ success: true })
})