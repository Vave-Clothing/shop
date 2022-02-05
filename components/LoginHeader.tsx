import tw from 'twin.macro'
import { cx, css } from '@emotion/css'
import { useSession, signOut } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { HiOutlineCog, HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi'
import { Fragment, useEffect } from 'react'
import getInitials from '@/lib/getInitials'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'

interface loginHeaderProps {
  white?: boolean
}

const LoginHeader = ({ white }: loginHeaderProps) => {
  const { status } = useSession()

  const { data, mutate } = useSWR('/api/auth/user/self?scopes=self', fetcher, { revalidateOnFocus: false, revalidateOnMount: false, revalidateOnReconnect: false })

  useEffect(() => {
    if(status === 'authenticated') mutate()
  }, [status, mutate])

  return (
    <>
      {
        status === 'authenticated' ? (
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button>
                  <span css={[tw`flex w-6 h-6 bg-black rounded-full items-center justify-center select-none`, white ? tw`xl:bg-white` : tw``]}>
                    <span css={[tw`text-white text-xs font-medium`, white ? tw`xl:text-black` : tw``]}>{ getInitials(data?.self.name || '@') }</span>
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  show={open}
                  {...{
                    enter: cx(css(tw`transition duration-100 ease-out origin-top-left`)),
                    enterFrom: cx(css(tw`transform scale-95 opacity-0`)),
                    enterTo: cx(css(tw`transform scale-100 opacity-100`)),
                    leave: cx(css(tw`transition duration-75 ease-out origin-top-left`)),
                    leaveFrom: cx(css(tw`transform scale-100 opacity-100`)),
                    leaveTo: cx(css(tw`transform scale-95 opacity-0`)),
                  }}
                >
                  <Menu.Items css={tw`absolute text-lg -left-1 top-7 bg-white border border-gray-200 rounded-lg px-1 shadow flex flex-col divide-y divide-gray-200`} static>
                    <div css={tw`py-1 w-full`}>
                      <Menu.Item as="div">
                        <Link href="/u/home" passHref>
                          <a href="/u/home" css={tw`flex items-center gap-2 hover:bg-gray-200 rounded-lg transition duration-200 px-2 w-full`}>
                            <HiOutlineCog />
                            <span>Profil</span>
                          </a>
                        </Link>
                      </Menu.Item>
                    </div>
                    <div css={tw`py-1 w-full`}>
                      <Menu.Item as="div">
                        <button onClick={() => signOut({ callbackUrl: '/auth/login' })} css={tw`flex items-center gap-2 hover:bg-gray-200 rounded-lg transition duration-200 px-2 w-full`}>
                          <HiOutlineLogout />
                          <span>Logout</span>
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        ) : (
          <span>
            <Link href="/auth/login" passHref>
              <a href="/auth/login" css={[tw`text-black`, white ? tw`xl:text-white` : tw`xl:text-black`]}>
                <HiOutlineUserCircle />
                <span css={tw`sr-only`}>Login</span>
              </a>
            </Link>
          </span>
        )
      }
    </>
  )
}

export default LoginHeader