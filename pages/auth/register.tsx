import type { NextPage } from "next"
import tw from 'twin.macro'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios, { AxiosError } from 'axios'
import { HiOutlineArrowNarrowRight, HiOutlineAtSymbol, HiOutlinePlus, HiOutlineUser, HiOutlineUserCircle } from 'react-icons/hi'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import FormField from '@/components/FormField'
import Joi from 'joi'
import toast from 'react-hot-toast'
import Link from 'next/link'
import FormCheckbox from "@/components/FormCheckbox"
import FormButton from "@/components/FormButton"

const ButtonDescription = () => {
  return (
    <>
      Ich stimme den{' '}
      <Link href="/terms-of-service" passHref>
        <a href="/terms-of-service" css={tw`text-indigo-500 hover:text-indigo-400 transition duration-200`}>
          AGBs
        </a>
      </Link>
      {' '}und der{' '}
      <Link href="/privacy" passHref>
        <a href="/privacy" css={tw`text-indigo-500 hover:text-indigo-400 transition duration-200`}>
          Datenschutzerklärung
        </a>
      </Link>
      {' '}zu
    </>
  )
}

const Register: NextPage = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsError, setTermsError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const router = useRouter()
  const { status } = useSession()

  const emailSchema = Joi.string().email({ tlds: false }).required().label('Email').messages({
    'any.required': `"Email" ist erforderlich`,
    'string.base': `"Email" muss eine Zeichenfolge sein`,
    'string.email': `"Email" muss eine gültige Email-Adresse sein`,
    'string.empty': `"Email" ist erforderlich`
  })

  const nameSchema = Joi.string().regex(/^(\w{1,}\s){1,}\w{1,}$/).required().label('Name').messages({
    'any.required': `"Name" ist erforderlich`,
    'string.base': `"Name" muss eine Zeichenfolge sein`,
    'string.empty': `"Name" ist erforderlich`,
    'string.pattern.base': `"Name" muss aus mindestens zwei Teilen bestehen`,
  })

  const validateTerms = (value?: boolean) => {
    let terms
    if(typeof value === "undefined") {
      terms = termsAccepted
    } else {
      terms = value
    }
    setTermsError(terms ? '' : `Dieses Feld ist erforderlich`)
    return terms
  }

  const validateEmail = (value?: string) => {
    const result = emailSchema.validate(value || email)
    setEmailError(result.error?.details[0].message || '')

    if(!result.error) return true
    return false
  }

  const validateName = (value?: string) => {
    const result = nameSchema.validate(value || name)
    setNameError(result.error?.details[0].message || '')

    if(!result.error) return true
    return false
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateEmail(value)
    setEmail(value)
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateName(value)
    setName(value)
  }

  const onChangeTerms = () => {
    const value = !termsAccepted
    validateTerms(value)
    setTermsAccepted(value)
  }

  const submit = async () => {
    const email = validateEmail()
    const terms = validateTerms()
    const name = validateName()
    if(email && terms && name) await handleSignIn()
  }

  const signUpWithEmail = async () => {
    return signIn('email', { email })
  }

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await axios.get('/api/auth/user/checkUser', { params: { email: email } })
      toast.error('Dieser Account ist bereits registriert')
      return setLoading(false)
    } catch(err) {
      const error = err as AxiosError
      if(error.response?.status !== 404) {
        toast.error('Ein fehler ist aufgetreten')
        return setLoading(false)
      }
    }

    await axios.post('/api/auth/user/preRegistration', { email: email, name: name })

    await signUpWithEmail()
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/u/home')
    }
  })

  return (
    <div css={tw`flex items-center flex-col gap-3 md:pt-6 pt-4`}>
      <div css={tw`flex flex-col items-center gap-4 md:gap-0`}>
        <div css={tw`text-5xl`}>
          <HiOutlineUserCircle />
        </div>
        <h1 css={tw`text-4xl font-semibold mb-4`}>Registrieren</h1>
        <div css={tw`w-full max-w-md flex flex-col gap-2`}>
          <FormFieldWrapper error={emailError}>
            <FormField
              value={email}
              onChange={onChangeEmail}
              placeholder='john.doe@example.com'
              prependIcon={<HiOutlineAtSymbol />}
              error={emailError ? true : false}
              onEnter={async () => await submit()}
              autocomplete='email'
              disabled={loading}
            />
          </FormFieldWrapper>
          <FormFieldWrapper error={nameError}>
            <FormField
              value={name}
              onChange={onChangeName}
              placeholder='John Doe'
              prependIcon={<HiOutlineUser />}
              error={nameError ? true : false}
              onEnter={async () => await submit()}
              autocomplete="name"
              disabled={loading}
            />
          </FormFieldWrapper>
          <FormCheckbox value={termsAccepted} onClick={onChangeTerms} title="Ich stimme zu" disabled={loading} description={<ButtonDescription />} error={termsError} />
          <FormButton onClick={async () => await submit()} loading={loading}>
            <>
              <HiOutlinePlus />
              <span>Registrieren</span>
            </>
          </FormButton>
        </div>
      </div>
      <span css={tw`text-indigo-500 hover:text-indigo-400 transition duration-200 text-sm`}>
        <Link href="/auth/login" passHref>
          <a href="/auth/login" css={tw`flex items-center gap-1`}>
            <span>Login</span>
            <HiOutlineArrowNarrowRight />
          </a>
        </Link>
      </span>
    </div>
  )
}

export default Register