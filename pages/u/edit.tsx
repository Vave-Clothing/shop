import FallbackPage from "@/components/FallbackPage"
import FormButton from "@/components/FormButton"
import FormField from "@/components/FormField"
import FormFieldWrapper from "@/components/FormFieldWrapper"
import UserHeader from "@/components/UserHeader"
import fetcher from "@/lib/fetcher"
import axios from "axios"
import Joi from "joi"
import type { NextPage } from "next"
import { useSession } from "next-auth/react"
import { ChangeEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { HiOutlineExternalLink, HiSave } from "react-icons/hi"
import useSWR from "swr"
import tw from 'twin.macro'

const Edit: NextPage = () => {
  const { status } = useSession({ required: true })

  const [name, setName] = useState('')
  const [loading, setLoading] = useState('no')
  const [error, setError] = useState('')

  const { data, mutate } = useSWR('/api/auth/user/self?scopes=self', fetcher, { revalidateOnFocus: false, revalidateOnMount: false, revalidateOnReconnect: false })

  useEffect(() => {
    if(status === 'authenticated' && !data) mutate()
    if(data) setName(data.self.name)
  }, [status, data, mutate])

  const nameSchema = Joi.string().regex(/^(\w{1,}\s){1,}\w{1,}$/).required().label('Name').messages({
    'string.base': `"Name" muss eine Zeichenfolge sein`,
    'string.empty': `"Name" darf nicht leer sein`,
    'string.pattern.base': `"Name" muss aus mindestens zwei Teilen bestehen`,
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const result = nameSchema.validate(value)
    setError(result.error?.details[0].message || '')
    setName(value)
  }

  const onSubmit = async () => {
    const value = name
    const result = nameSchema.validate(value)
    setError(result.error?.details[0].message || '')
    if(!result.error) {
      try {
        setLoading('save')
        await axios.patch('/api/auth/user/updateName', { name: name })
        setLoading('no')
        toast.success('Name aktualisiert')
        mutate()
      } catch(err) {
        toast.error('Etwas ist schiefgelaufen')
        setLoading('no')
      }
    }
  }

  const goToCustomerPortal = async () => {
    const data = await axios.post('/api/auth/user/getCustomerPortal').then(res => res.data)
    if(data.noCustomer) return
    window.location = data.url
  }

  if(status === 'authenticated') return (
    <div css={tw`flex flex-col gap-4 items-center`}>
      <UserHeader name={data?.self.name} email={data?.self.email} />
      <div css={tw`w-full max-w-5xl`}>
        <h1 css={tw`text-xl font-semibold leading-tight`}>User-Informationen</h1>
        <span css={tw`block mb-4 leading-tight font-light text-sm`}>Bearbeite hier deine User-Infos</span>
        <div css={tw`grid md:grid-cols-2 gap-2`}>
          <div css={tw`flex justify-start flex-col gap-1`}>
            <FormFieldWrapper title="Name" error={error}>
              <FormField value={name} onChange={onChange} placeholder="John Doe" disabled={loading !== 'no'} onEnter={() => onSubmit()} error={error ? true : false} />
            </FormFieldWrapper>
            <FormFieldWrapper title="Email" error="Emails können momentan nicht geändert werden">
              <FormField value={data?.self.email} onChange={() => { return }} disabled={true} error={true} />
            </FormFieldWrapper>
          </div>
          <div css={tw`flex justify-start flex-col gap-2`}>
            <div>
              <span css={tw`text-gray-600 dark:text-gray-300 text-xs font-light`}>Bearbeite hier deine Lieferadresse</span>
              <FormButton onClick={() => goToCustomerPortal()} loading={loading === 'portal'} disabled={loading === 'save'}>
                <>
                  <HiOutlineExternalLink />
                  <span>Stripe Kundenportal</span>
                </>
              </FormButton>
            </div>
            <FormButton onClick={() => onSubmit()} loading={loading === 'save'} disabled={loading === 'portal'}>
              <>
                <HiSave />
                <span>Speichern</span>
              </>
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  )

  return <FallbackPage />
}

export default Edit