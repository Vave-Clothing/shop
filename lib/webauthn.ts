import { Binary } from 'mongodb'
import dbConnect from '@/lib/dbConnect'
import WebauthnChallenge from '@/schemas/WebauthnChallenge'
import WebauthnCredential from '@/schemas/WebauthnCredential'

export interface DbCredential {
  credentialID: string
  userID: string
  userEmail: string
  transports: AuthenticatorTransport[]
  credentialPublicKey: Binary | Buffer
  counter: number
}

export const saveChallenge = async ({ userID, challenge }: { challenge: string, userID: string }) => {
  await dbConnect()
  await WebauthnChallenge.updateOne({ userID }, { $set: { value: challenge } }, { upsert: true })
}

export const getChallenge = async (userID: string) => {
  await dbConnect()
  const challengeObj = await WebauthnChallenge.findOneAndDelete({ userID })
  return challengeObj
}

export const saveCredentials = async (cred: { transports: AuthenticatorTransport[]; credentialID: string; counter: number; userID: string; userEmail: string; key: Buffer; name: string }) => {
  await dbConnect()
  const credential = new WebauthnCredential({
    credentialID: cred.credentialID,
    transports: cred.transports,
    userID: cred.userID,
    userEmail: cred.userEmail,
    credentialPublicKey: cred.key,
    counter: cred.counter,
    credentialName: cred.name,
  })
  await credential.save()
}
