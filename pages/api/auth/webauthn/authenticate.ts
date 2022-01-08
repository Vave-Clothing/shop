import { NextApiRequest, NextApiResponse } from 'next'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { saveChallenge } from '@/lib/webauthn'
import Joi from 'joi'
import validate from '@/lib/middlewares/validation'
import WebauthnCredential from '@/schemas/WebauthnCredential'
import dbConnect from '@/lib/dbConnect'
import clientPromise from '@/lib/mongodb'

const querySchema = Joi.object({
  email: Joi.string().email().required(),
})

export default validate({ query: querySchema }, async ( req: NextApiRequest, res: NextApiResponse, ) => {
  if (req.method === 'GET') {
    await dbConnect()
    const email = req.query.email.toString()

    const credentials = await WebauthnCredential.find({ userEmail: email })

    const options = generateAuthenticationOptions({
      userVerification: 'preferred',
    })
    options.allowCredentials = credentials.map(c => ({
      id: c.credentialID,
      type: 'public-key',
    }))

    const mongo = await clientPromise

    try {
      const user = await mongo.db().collection('users').findOne({ email: email })
      await saveChallenge({ userID: String(user!._id), challenge: options.challenge })
    } catch (err) {
      return res.status(500).send({ code: 500, message: 'could not set up challenge' })
    }
    return res.send(options)
  }
  res.setHeader('Allow', 'GET')
  return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
})
