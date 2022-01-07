import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise, { getDb } from '@/lib/mongodb'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import base64url from 'base64url'
import {  getChallenge } from '@/lib/webauthn'
import dbConnect from '@/lib/dbConnect'
import WebauthnCredential from '@/schemas/WebauthnCredential'

const domain = process.env.APP_DOMAIN
const origin = process.env.APP_ORIGIN

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    providers: [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM
      }),
      CredentialsProvider({
        name: 'webauthn',
        credentials: {},
        async authorize(cred, req) {
          const {
            id,
            rawId,
            type,
            clientDataJSON,
            authenticatorData,
            signature,
            userHandle,
          } = req.body as any
  
          const credential = {
            id,
            rawId,
            type,
            response: {
              clientDataJSON,
              authenticatorData,
              signature,
              userHandle,
            },
          }

          await dbConnect()

          const authenticator = await WebauthnCredential.findOne({
            credentialID: credential.id
          })
          if (!authenticator) {
            return null
          }

          const challenge = await getChallenge(authenticator.userID)
          if (!challenge) {
            return null
          }

          try {
            const { verified, authenticationInfo: info } = verifyAuthenticationResponse({
              credential: credential as any,
              expectedChallenge: challenge.value,
              expectedOrigin: origin,
              expectedRPID: domain,
              authenticator: {
                credentialPublicKey: authenticator.credentialPublicKey as Buffer,
                credentialID: base64url.toBuffer(authenticator.credentialID),
                counter: authenticator.counter,
              },
            })
            if (!verified || !info) {
              return null
            }

            await WebauthnCredential.updateOne({
              _id: authenticator._id
            }, {
              $set: {
                counter: info.newCounter
              }
            })
          } catch (err) {
            console.log(err)
            return null
          }
          return { email: authenticator.userEmail }
        }
      })    
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
      strategy: 'jwt'
    },
    pages: {
      signIn: '/auth/login',
      verifyRequest: '/auth/login?verifyRequest=true'
    }
  })
}
