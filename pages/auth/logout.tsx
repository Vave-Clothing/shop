import FormButton from "@/components/FormButton"
import type { NextPage } from "next"
import { HiOutlineLogout } from "react-icons/hi"
import tw from 'twin.macro'
import { useSession, signOut } from 'next-auth/react'
import FallbackPage from "@/components/FallbackPage"
import useSWR from "swr"
import fetcher from "@/lib/fetcher"
import getInitials from "@/lib/getInitials"

const Logout: NextPage = () => {
  const { status } = useSession({
    required: true
  })

  const { data } = useSWR('/api/auth/user/self?scopes=self', fetcher)

  if(status === 'authenticated') return (
    <div css={tw`flex items-center flex-col gap-3 md:pt-6 pt-4`}>
      <div css={tw`flex flex-col items-center gap-4 md:gap-0`}>
        <div css={tw`select-none`}>
          <span css={tw`flex w-12 h-12 bg-black dark:bg-gray-100 rounded-full items-center justify-center`}>
            <span css={tw`text-white dark:text-black text-xl font-semibold`}>{ getInitials(data?.self.name || '') }</span>
          </span>
        </div>
        <h1 css={tw`text-4xl font-semibold mb-4`}>Logout</h1>
        <div css={tw`w-full max-w-md flex flex-col gap-2`}>
          <p>Bist du sicher, dass du dich ausloggen willst ???</p>
          <FormButton onClick={() => signOut({ callbackUrl: '/auth/login' })}>
            <>
              <HiOutlineLogout />
              <span>Logout</span>
            </>
          </FormButton>
        </div>
      </div>
    </div>
  )
  return (
    <FallbackPage />
  )
}

export default Logout