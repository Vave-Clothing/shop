import UserHeader from "@/components/UserHeader"
import { browserSupportsWebauthn, platformAuthenticatorIsAvailable, startRegistration } from "@simplewebauthn/browser"
import axios from "axios"
import type { NextPage } from "next"
import tw from 'twin.macro'
import useSWR from "swr"
import fetcher from "@/lib/fetcher"
import { useSession } from "next-auth/react"
import FallbackPage from "@/components/FallbackPage"
import { HiOutlineCheck, HiOutlineFingerPrint, HiOutlinePencilAlt, HiOutlinePlus, HiOutlineSave, HiOutlineTrash, HiOutlineX } from "react-icons/hi"
import IconButton from "@/components/IconButton"
import Button from "@/components/Button"
import Dialog from "@/components/Dialog"
import { ChangeEvent, Fragment, useState } from "react"
import FormFieldWrapper from "@/components/FormFieldWrapper"
import FormField from "@/components/FormField"
import FormFieldButton from "@/components/FormFieldButton"
import Joi from 'joi'
import { RadioGroup } from '@headlessui/react'
import toast from "react-hot-toast"

const Security: NextPage = () => {
  const { status } = useSession({ required: true })

  const canWebauthn = browserSupportsWebauthn()
  const [canPlatformKey, setCanPlatformKey] = useState(false)

  const [addKeyDialog, setAddKeyDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyError, setNewKeyError] = useState('')
  const [newKeyType, setNewKeyType] = useState('cross-platform')
  const [newKeyLoading, setNewKeyLoading] = useState(false)

  const [deleteKeyDialog, setDeleteKeyDialog] = useState(false)
  const [deleteKeyID, setDeleteKeyID] = useState('')
  const [deleteKeyLoading, setDeleteKeyLoading] = useState(false)

  const [editKeyDialog, setEditKeyDialog] = useState(false)
  const [editKeyID, setEditKeyID] = useState('')
  const [editKeyName, setEditKeyName] = useState('')
  const [editKeyError, setEditKeyError] = useState('')
  const [editKeyLoading, setEditKeyLoading] = useState(false)

  const registerWebauthn = async (platform?: boolean) => {
    const optionsResponse = await axios.get('/api/auth/webauthn/register', { params: { platform: platform } })
    if (optionsResponse.status !== 200) {
      toast.error('Es konnten keine Optionen vom Server abgerufen werden')
      return false
    }
    const opt = await optionsResponse.data

    try {
      const credential = await startRegistration(opt)

      const response = await axios.post('/api/auth/webauthn/register', credential, { params: { name: newKeyName } })
      if (response.status != 201) {
        toast.error('Der Sicherheitsschlüssel konnte nicht registriet werden')
        return false
      } else {
        toast.success('Dein Sicherheitsschlüssel wurde registriert')
        return true
      }
    } catch (err) {
      switch ((err as Error).name) {
        case 'NotAllowedError':
          toast.error('Anfrage wurde abgelehnt')
          break
        case 'InvalidStateError':
          toast.error('Dieser Schlüssel ist bereits registriert')
          break
        default:
          toast.error(`Registration failed. ${(err as Error).message}`)
          break
      }
      return false
    }

  }

  const nameSchema = Joi.string().min(3).required().label('Name').messages({
    'string.base': `"Name" muss eine Zeichenfolge sein`,
    'string.empty': `"Name" ist erforderlich`,
    'string.min': `"Name" muss mindestens drei Zeichen lang sein`,
  })

  const onChangeName = (e: ChangeEvent<HTMLInputElement>, action: "add" | "edit") => {
    const result = nameSchema.validate(e.target.value)
    if(action === "add") {
      setNewKeyError(result.error?.details[0].message || '')
      setNewKeyName(e.target.value)
    } else if(action === "edit") {
      setEditKeyError(result.error?.details[0].message || '')
      setEditKeyName(e.target.value)
    }
  }

  const addNewKey = async () => {
    const result = nameSchema.validate(newKeyName)
    setNewKeyError(result.error?.details[0].message || '')
    const platform = newKeyType === 'platform' ? true : false
    
    if(!result.error) {
      setNewKeyLoading(true)
      const registration = await registerWebauthn(platform)
      setNewKeyLoading(false)
      if(registration === true) {
        setNewKeyName('')
        setNewKeyType('cross-platform')
        setAddKeyDialog(false)
        mutate()
      }
    }
  }

  const editKey = async (id: string) => {
    const result = nameSchema.validate(editKeyName)
    setEditKeyError(result.error?.details[0].message || '')
    if(result.error) return

    setEditKeyLoading(true)
    await axios.patch('/api/auth/webauthn/edit', { id, name: editKeyName })
    setEditKeyLoading(false)
    closeDialog("edit")
    mutate()
    toast.success('Sicherheitsschlüssel bearbeitet')
  }

  const deleteKey = async (id: string) => {
    setDeleteKeyLoading(true)
    await axios.delete('/api/auth/webauthn/delete', { data: { id } })
    setDeleteKeyLoading(false)
    closeDialog("delete")
    mutate()
    toast.success('Sicherheitsschlüssel gelöscht')
  }

  const closeDialog = (type: "add" | "edit" | "delete") => {
    switch (type) {
      case "add":
        if(newKeyLoading === false) setAddKeyDialog(false)
        break
      case "edit":
        if(editKeyLoading === true) return
        setEditKeyID('')
        setEditKeyName('')
        setEditKeyError('')
        setEditKeyDialog(false)
        break
      case "delete":
        if(deleteKeyLoading === true) return
        setDeleteKeyID('')
        setDeleteKeyDialog(false)
        break
      default:
        break
    }
  }

  const openDialog = async (type: "add" | "edit" | "delete", id?: string, name?: string) => {
    switch (type) {
      case "add":
        const platformKey = await platformAuthenticatorIsAvailable()
        setCanPlatformKey(platformKey)
        setAddKeyDialog(true)
        break
      case "edit":
        if(!id) throw new Error('No ID specified')
        setEditKeyName(name || '')
        setEditKeyID(id)
        setEditKeyDialog(true)
        break
      case "delete":
        if(!id) throw new Error('No ID specified')
        setDeleteKeyID(id)
        setDeleteKeyDialog(true)
        break
      default:
        break
    }
  }

  const { data, mutate } = useSWR('/api/auth/user/self?scopes=self security', fetcher)

  if(status === 'authenticated') return (
    <div css={tw`flex flex-col gap-4 items-center`}>
      <UserHeader name={data?.self.name} email={data?.self.email} />
      <div css={tw`w-full max-w-5xl`}>
        <h1 css={tw`text-xl font-semibold leading-tight`}>WebAuthn <span css={tw`font-medium`}>Sicherheitsschlüssel</span></h1>
        <span css={tw`block mb-4 leading-tight font-light text-sm`}>Melde dich mit einem Sicherheitsschlüssel schneller an und klicke nicht mehr in Emails rum</span>
        <table css={tw`table-fixed w-full`}>
          <thead>
            <tr css={tw`border-b border-b-gray-200`}>
              <th>
                Name
              </th>
              <th>
                <span css={tw`block md:hidden`}>Datum</span>
                <span css={tw`hidden md:block`}>Registrationsdatum</span>
              </th>
              <th>
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody>
            {
              data?.security.map((s: any) => (
                <tr key={s.id} css={tw`last-of-type:border-b-0 border-b border-b-gray-200 text-center`}>
                  <td css={tw`font-medium`}>{ s.credentialName }</td>
                  <td css={tw`font-light`}>{ new Date(s.createdAt).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }</td>
                  <td css={tw`flex gap-2 justify-center py-2`}>
                    <IconButton onClick={() => openDialog("edit", s.id, s.credentialName)} icon={<HiOutlinePencilAlt />} />
                    <IconButton onClick={() => openDialog("delete", s.id)} icon={<HiOutlineTrash />} />
                  </td>
                </tr>
              ))
            }
            {
              data?.security.length < 1 &&
              <tr css={tw`text-center`}>
                <td></td>
                <td css={tw`block font-light py-2`}>Keine Sicherheitsschlüssel registriert</td>
                <td></td>
              </tr>
            }
            {/* Edit Key Dialog */}
            <Dialog show={editKeyDialog} onClose={() => closeDialog("edit")}>
              <>
                <div css={tw`flex items-center justify-center text-3xl my-2 gap-2`}>
                  <HiOutlineFingerPrint />
                  <span css={tw`text-xl`}>Schlüssel bearbeiten</span>
                </div>
                <FormFieldWrapper error={editKeyError}>
                  <>
                    <FormField value={editKeyName} onChange={(e) => onChangeName(e, "edit")} placeholder="Name" error={editKeyError ? true : false} onEnter={() => editKey(editKeyID)} disabled={editKeyLoading} />
                    <FormFieldButton onClick={() => editKey(editKeyID)} loading={editKeyLoading}>
                      <>
                        <HiOutlineSave />
                        <span>Speichern</span>
                      </>
                    </FormFieldButton>
                  </>
                </FormFieldWrapper>
              </>
            </Dialog>
            {/* Delete Key Dialog */}
            <Dialog show={deleteKeyDialog} onClose={() => closeDialog("delete")}>
              <>
                <div css={tw`flex items-center justify-center text-3xl my-2 gap-2`}>
                  <HiOutlineFingerPrint />
                  <span css={tw`text-xl`}>Schlüssel löschen</span>
                </div>
                <div css={tw`grid grid-cols-2 gap-2`}>
                  <Button onClick={() => deleteKey(deleteKeyID)} adCss={tw`border-red-500`} loading={deleteKeyLoading}>
                    <>
                      <HiOutlineCheck />
                      <span>Löschen</span>
                    </>
                  </Button>
                  <Button onClick={() => closeDialog("delete")} adCss={tw`border-green-500`} disabled={deleteKeyLoading}>
                    <>
                      <HiOutlineX />
                      <span>Abbrechen</span>
                    </>
                  </Button>
                </div>
              </>
            </Dialog>
          </tbody>
        </table>
        <div css={tw`flex justify-end gap-2`}>
          <Button onClick={() => openDialog("add")} size="small" disabled={!canWebauthn}>
            <>
              <HiOutlinePlus />
              <span>Schlüssel hinzufügen</span>
            </>
          </Button>
          <Dialog show={addKeyDialog} onClose={() => closeDialog("add")}>
            <>
              <div css={tw`flex items-center justify-center text-3xl my-2 gap-2`}>
                <HiOutlineFingerPrint />
                <span css={tw`text-xl`}>Schlüssel hinzufügen</span>
              </div>
              <FormFieldWrapper error={newKeyError}>
                <>
                  <FormField value={newKeyName} onChange={(e) => onChangeName(e, "add")} placeholder="Name" error={newKeyError ? true : false} onEnter={() => addNewKey()} disabled={newKeyLoading} />
                  <FormFieldButton onClick={() => addNewKey()} loading={newKeyLoading}>
                    <>
                      <HiOutlinePlus />
                      <span>Hinzufügen</span>
                    </>
                  </FormFieldButton>
                </>
              </FormFieldWrapper>
              <RadioGroup value={newKeyType} onChange={setNewKeyType} disabled={newKeyLoading}>
                <RadioGroup.Label as={Fragment}>
                  <span css={tw`block mb-1 font-medium`}>Schlüsseltyp</span>
                </RadioGroup.Label>
                <div css={tw`ml-1`}>
                  <RadioGroup.Option value="cross-platform">
                    {({ checked, disabled }) => (
                      <span css={[tw`cursor-pointer flex items-center gap-1`, disabled ? tw`text-gray-600 cursor-not-allowed` : tw`text-black`]}>
                        <span css={[tw`block w-4 h-4 rounded-full ring-4 ring-inset ring-offset-4 ring-offset-white border border-gray-200 flex-shrink-0`, checked ? disabled ? tw`ring-gray-600` : tw`ring-black` : tw`ring-white`]} />
                        <span>Cross-Plaform (z.B. Yubikey)</span>
                      </span>
                    )}
                  </RadioGroup.Option>
                  <RadioGroup.Option value="platform" disabled={!canPlatformKey}>
                    {({ checked, disabled }) => (
                      <span css={[tw`cursor-pointer flex items-center gap-1`, disabled ? tw`text-gray-600 cursor-not-allowed` : tw`text-black`]}>
                        <span css={[tw`block w-4 h-4 rounded-full ring-4 ring-inset ring-offset-4 ring-offset-white border border-gray-200 flex-shrink-0`, checked ? disabled ? tw`ring-gray-600` : tw`ring-black` : tw`ring-white`]} />
                        <span>Plaform (z.B. Touch-ID, Windows Hello, Face-ID)</span>
                      </span>
                    )}
                  </RadioGroup.Option>
                </div>
              </RadioGroup>
            </>
          </Dialog>
        </div>
      </div>
    </div>
  )

  return <FallbackPage />
}

export default Security