import type { NextPage } from 'next'
import tw from 'twin.macro'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types'
import { startAuthentication } from '@simplewebauthn/browser'
import axios from 'axios'
import { HiOutlineAtSymbol, HiOutlineKey, HiOutlineUserCircle } from 'react-icons/hi'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import FormField from '@/components/FormField'
import FormFieldButton from '@/components/FormFieldButton'
import Joi from 'joi'

const Login: NextPage = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { query: { callbackUrl, verifyRequest } } = router
  const { status } = useSession()

  const schema = Joi.string().email({ tlds: false }).required().label('Email').messages({
    'any.required': `"Email" ist erforderlich`,
    'string.base': `"Email" muss eine Zeichenfolge sein`,
    'string.email': `"Email" muss eine gültige Email-Adresse sein`,
    'string.empty': `"Email" ist erforderlich`
  })

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const result = schema.validate(value)
    setError(result.error?.details[0].message || '')
    setEmail(value)
  }

  const submit = async () => {
    const value = email
    const result = schema.validate(value)
    if(result.error) {
      setError(result.error?.details[0].message || '')
    } else {
      await handleSignIn()
    }
  }

  const signInWithEmail = async () => {
    return signIn('email', { email })
  }

  const signInWithWebauthn = async () => {
    const optionsResponse = await axios.get('/api/auth/webauthn/authenticate', { params: { email: email } })
  
    if (optionsResponse.status !== 200) {
      throw new Error('could not get authentication options from server')
    }
    const opt: PublicKeyCredentialRequestOptionsJSON = optionsResponse.data
  
    if (!opt.allowCredentials || opt.allowCredentials.length === 0) {
      throw new Error('there are no registered credentials')
    }
  
    const credential = await startAuthentication(opt)
  
    await signIn('credentials', {
      id: credential.id,
      rawId: credential.rawId,
      type: credential.type,
      clientDataJSON: credential.response.clientDataJSON,
      authenticatorData: credential.response.authenticatorData,
      signature: credential.response.signature,
      userHandle: credential.response.userHandle,
    })
  }

  const handleSignIn = async () => {
    setLoading(true)

    try {
      await signInWithWebauthn()
    } catch(err) {
      await signInWithEmail()
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      if(callbackUrl) {
        router.push(callbackUrl.toString())
      } else {
        router.push('/auth/user')
      }
    }
  })

  if(verifyRequest === 'true') return (
    <div css={tw`flex items-center flex-col gap-3 md:pt-6 pt-4`}>
      <div css={tw`flex flex-col items-center gap-4 md:gap-0`}>
        <div css={tw`text-5xl`}>
          <HiOutlineUserCircle />
        </div>
        <h1 css={tw`text-4xl font-semibold mb-4`}>Login</h1>
        <div css={tw`w-full max-w-sm text-center`}>
          <p css={tw`text-lg`}>Um dich anzumelden, musst du auf den Link in der Email klicken, die du gerade von uns erhalten hast.</p>
          <p css={tw`font-light text-gray-600`}>Die Email ist von <span css={tw`text-black font-normal`}>noreply@vave-clohting.de</span></p>
        </div>
      </div>
    </div>
  )

  return (
    <div css={tw`flex items-center flex-col gap-3 md:pt-6 pt-4`}>
      <div css={tw`flex flex-col items-center gap-4 md:gap-0`}>
        <div css={tw`text-5xl`}>
          <HiOutlineUserCircle />
        </div>
        <h1 css={tw`text-4xl font-semibold mb-4`}>Login</h1>
        <div css={tw`w-full max-w-sm`}>
          <FormFieldWrapper error={error}>
            <>
              <FormField
                value={email}
                onChange={onChangeEmail}
                placeholder='john.doe@example.com'
                prependIcon={<HiOutlineAtSymbol />}
                error={error ? true : false}
                onEnter={async () => await submit()}
                autocomplete='email'
                disabled={loading}
              />
              <FormFieldButton onClick={async () => await submit()} loading={loading}>
                <>
                  <HiOutlineKey />
                  <span>Login</span>
                </>
              </FormFieldButton>
            </>
          </FormFieldWrapper>
        </div>
      </div>
    </div>
  )
}

export default Login