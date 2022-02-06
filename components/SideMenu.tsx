import tw from 'twin.macro'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { HiOutlineUserCircle, HiOutlineX } from 'react-icons/hi'
import { Transition } from '@headlessui/react'
import { css, cx } from '@emotion/css'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import getInitials from '@/lib/getInitials'

const menuItems = [
  { title: 'Home', href: '/' },
  { title: 'Produkte', href: '/shop' },
  { title: 'Einkaufswagen', href: '/cart' },
]

const footerMenuItems = [
  { title: 'Zahlungsmöglichkeiten', href: '/paymentmethods' },
  { title: 'AGBs', href: '/terms-of-service' },
  { title: 'Datenschutz', href: '/privacy' },
]

interface sideMenuProps {
  open: boolean,
  close: Dispatch<SetStateAction<boolean>>
}

const SideMenu = ({ open, close }: sideMenuProps) => {
  const { status, data: session } = useSession()

  const { data, mutate } = useSWR('/api/auth/user/self?scopes=self', fetcher, { revalidateOnFocus: false, revalidateOnMount: false, revalidateOnReconnect: false })

  useEffect(() => {
    if(status === 'authenticated') mutate()
  }, [status, mutate])

  return (
    <div css={tw`fixed top-0 left-0 z-50`}>
      <Transition
        show={open}
        {...{
          enter: cx(css(tw`transition-opacity duration-300`)),
          enterFrom: cx(css(tw`opacity-0`)),
          enterTo: cx(css(tw`opacity-100`)),
          leave: cx(css(tw`transition-opacity duration-300`)),
          leaveFrom: cx(css(tw`opacity-100`)),
          leaveTo: cx(css(tw`opacity-0`)),
        }}
      >
        <div css={tw`fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-20 dark:bg-opacity-30 hidden sm:block`} onClick={() => { close(false) }}></div>
      </Transition>

      {/* This is a very bad way of implementing an animation */}
      <div css={[
        tw`fixed top-0 right-0 sm:bg-gray-100 bg-white max-w-[40rem] w-full h-full py-4 px-6 sm:border-l border-gray-200 transform transition-all duration-300 dark:(sm:bg-gray-800 bg-gray-900! border-gray-700)`, 
        open ? tw`translate-x-0` : tw`translate-x-full`
      ]}>
        <div css={tw`flex flex-col text-xl gap-4 items-stretch h-full`}>
          <div css={tw`flex justify-end items-center text-2xl mb-4`}>
            <span>
              <button onClick={() => { close(false) }} tabIndex={!open ? -1 : 0}>
                <HiOutlineX />
                <span css={tw`sr-only`}>Schließen</span>
              </button>
            </span>
          </div>
          {
            status === 'authenticated' ? (
              <Link href="/u/home" passHref>
                <a href="/u/home" css={tw`flex gap-2 items-center flex-grow-0`} tabIndex={!open ? -1 : 0} onClick={() => close(false)}>
                  <span css={tw`flex w-5 h-5 bg-black dark:bg-gray-100 items-center justify-center rounded-full`}>
                    <span css={tw`text-xs font-medium text-white dark:text-black`}>{ getInitials(data?.self.name || '@') }</span>
                  </span>
                  <span>{ data?.self.name || session?.user?.email }</span>
                </a>
              </Link>
            ) : (
              <Link href="/auth/login" passHref>
                <a href="/auth/login" css={tw`flex gap-2 items-center flex-grow-0 select-none`} tabIndex={!open ? -1 : 0} onClick={() => close(false)}>
                  <HiOutlineUserCircle />
                  <span>Login</span>
                </a>
              </Link>
            )
          }
          <div css={tw`flex flex-col justify-between flex-grow leading-relaxed`}>
            <ul>
              {
                menuItems.map((item, i) => (
                  <li key={i} onClick={() => close(false)}>
                    <Link href={item.href} passHref>
                      <a href={item.href} tabIndex={!open ? -1 : 0}>
                        {item.title}
                      </a>
                    </Link>
                  </li>
                ))
              }
            </ul>
            <ul css={tw`text-base text-gray-500`}>
              {
                footerMenuItems.map((item, i) => (
                  <li key={i} onClick={() => close(false)}>
                    <Link href={item.href} passHref>
                      <a href={item.href} tabIndex={!open ? -1 : 0}>
                        {item.title}
                      </a>
                    </Link>
                  </li>
                ))
              }
              <li>&copy; { new Date().getFullYear() } Vave Clothing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu