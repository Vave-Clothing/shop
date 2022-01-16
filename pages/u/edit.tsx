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
import { HiSave } from "react-icons/hi"
import useSWR from "swr"
import tw from 'twin.macro'

const Edit: NextPage = () => {
  const { status } = useSession({ required: true })

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data, mutate } = useSWR('/api/auth/user/self?scopes=self security', fetcher, { revalidateOnFocus: false, revalidateOnMount: false, revalidateOnReconnect: false })

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
        setLoading(true)
        await axios.patch('/api/auth/user/updateName', { name: name })
        setLoading(false)
        toast.success('Name aktualisiert')
        mutate()
      } catch(err) {
        toast.error('Etwas ist schiefgelaufen')
        setLoading(false)
      }
    }
  }

  if(status === 'authenticated') return (
    <div css={tw`flex flex-col gap-4 items-center`}>
      <UserHeader name={data?.self.name} email={data?.self.email} />
      <div css={tw`w-full max-w-5xl`}>
        <h1 css={tw`text-xl font-semibold leading-tight`}>User-Informationen</h1>
        <span css={tw`block mb-4 leading-tight font-light text-sm`}>Bearbeite hier deine User-Infos</span>
        <div css={tw`grid md:grid-cols-2 gap-2`}>
          <div>
            <FormFieldWrapper title="Email" error="Emails können momentan nicht geändert werden">
              <FormField value={data?.self.email} onChange={() => { return }} disabled={true} error={true} />
            </FormFieldWrapper>
          </div>
          <div css={tw`flex justify-end flex-col gap-1`}>
            <FormFieldWrapper title="Name" error={error}>
              <FormField value={name} onChange={onChange} placeholder="John Doe" disabled={loading} onEnter={() => onSubmit()} error={error ? true : false} />
            </FormFieldWrapper>
            <FormButton onClick={() => onSubmit()} loading={loading}>
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