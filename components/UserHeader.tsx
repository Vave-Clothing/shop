import getInitials from '@/lib/getInitials'
import Link from 'next/link'
import { HiOutlineHome } from 'react-icons/hi'
import tw from 'twin.macro'

interface userHeaderProps {
  name?: string
  email?: string
}

const UserHeader = ({ name, email }: userHeaderProps) => {
  const inputName = name ? name : ''
  const inputEmail = email ? email : ''

  return (
    <div css={tw`flex gap-3 items-center w-full`}>
      <span css={tw`flex text-xl bg-black items-center justify-center w-14 h-14 text-white rounded-full font-semibold select-none`}>
        <span>{ getInitials(inputName) }</span>
      </span>
      <div css={tw`flex flex-col`}>
        <span css={tw`text-lg font-medium leading-tight`}>{ inputName }</span>
        <span css={tw`text-sm font-light leading-tight`}>{ inputEmail }</span>
        <span css={tw`text-xs font-light leading-tight text-indigo-500 hover:text-indigo-400 transition duration-200`}>
          <Link href="/u/home" passHref>
            <a href="/u/home" css={tw`flex items-center gap-0.5`}>
              <HiOutlineHome />
              <span>Home</span>
            </a>
          </Link>
        </span>
      </div>
    </div>
  )
}

export default UserHeader