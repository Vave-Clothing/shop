import { NextApiRequest, NextApiResponse } from 'next'
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
import { RegistrationCredentialJSON } from '@simplewebauthn/typescript-types'
import { getChallenge, saveChallenge, saveCredentials } from '@/lib/webauthn'
import WebauthnCredential from '@/schemas/WebauthnCredential'
import dbConnect from '@/lib/dbConnect'

const domain = process.env.APP_DOMAIN
const origin = process.env.APP_ORIGIN
const appName = process.env.APP_NAME

const handlePreRegister = async ( req: NextApiRequest, res: NextApiResponse ) => {
  const session = await getSession({ req })

  const email = session?.user?.email
  if (!email) {
    return res.status(401).send({ code: 401, message: 'Unauthorized' })
  }

  await dbConnect()
  const credentials = await WebauthnCredential.find({ userEmail: email })

  const platform = req.query['platform']

  const options = generateRegistrationOptions({
    rpID: domain,
    rpName: appName,
    userID: email,
    userName: email,
    attestationType: 'none',
    authenticatorSelection: {
      userVerification: 'preferred',
      authenticatorAttachment: platform ? 'platform' : 'cross-platform',
    },
  })
  options.excludeCredentials = credentials.map(c => ({
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

const handleRegister = async ( req: NextApiRequest, res: NextApiResponse ) => {
  const session = await getSession({ req })

  const email = session?.user?.email
  if (!email) {
    return res.status(401).send({ code: 401, message: 'Unauthorized' })
  }

  const mongo = await clientPromise
  let user
  try {
    user = await mongo.db().collection('users').findOne({ email: email })
  } catch(err) {
    return res.status(500).send({ code: 500, message: 'Internal Server Error' })
  }

  const challenge = await getChallenge(String(user!._id))
  if (!challenge) {
    return res.status(403).send({ code: 403, message: 'Pre-registration is required' })
  }

  const credential: RegistrationCredentialJSON = req.body

  const { verified, registrationInfo: info } = await verifyRegistrationResponse({
    credential,
    expectedRPID: domain,
    expectedOrigin: origin,
    expectedChallenge: challenge.value,
  })
  if (!verified || !info) {
    return res.status(500).send({ code: 500, message: 'Internal Server Error' })
  }

  try {
    await saveCredentials({
      credentialID: credential.id,
      transports: credential.transports ?? ['internal'],
      userID: String(user!._id),
      userEmail: email,
      key: info.credentialPublicKey,
      counter: info.counter
    })
    return res.status(201).send({ success: true })
  } catch (err) {
    return res.status(500).send({ code: 500, message: 'Could not register credential' })
  }
}

export default async function Register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return handlePreRegister(req, res)
  }
  if (req.method === 'POST') {
    return handleRegister(req, res)
  }
  res.setHeader('Allow', 'GET, POST')
  return res.status(405).send({ code: 405, message: 'Method Not Allowed' })
}
