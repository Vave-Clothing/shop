import { css, cx } from '@emotion/css'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { HiOutlineChevronDoubleDown, HiOutlineDesktopComputer, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'
import tw from 'twin.macro'
import { changeDarkmode, getCurrentTheme } from '@/lib/darkmode'
import Link from 'next/link'

const footerItems = [
  { title: 'Zahlungsmöglichkeiten', href: '/paymentmethods' },
  { title: 'AGBs', href: '/terms-of-service' },
  { title: 'Datenschutz', href: '/privacy' },
]

const Footer = () => {
  const [viewMore, setViewMore] = useState(false)

  const viewMoreOpen = () => {
    setViewMore(true)
    setTimeout(() => {
      const app = document.getElementById('app')

      if(document.body.offsetWidth < 1280) {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        app!.scrollTo({
          left: 0,
          top: app?.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, 220);
  }

  return (
    <>
      <div css={tw`flex justify-between text-gray-400 dark:text-gray-600 max-w-[96rem] w-full px-6`}>
        <div>&copy; { new Date().getFullYear() } Vave Clothing</div>
        <div css={tw`flex items-center gap-2`}>
          <div css={tw`flex items-center`}>
            <button onClick={
              () => {
                if(viewMore) return setViewMore(false)
                viewMoreOpen()
              }
            }>
              <span css={[
                tw`block transition duration-200`,
                viewMore ? tw`rotate-180` : tw`rotate-0`
              ]}>
                <HiOutlineChevronDoubleDown />
              </span>
            </button>
          </div>
          <div css={tw`relative flex items-center`}>
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button>
                    <span>
                      {
                        getCurrentTheme() === 'dark' ? (
                          <HiOutlineMoon />
                        ) : (
                          <HiOutlineSun />
                        )
                      }
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    show={open}
                    {...{
                      enter: cx(css(tw`transition duration-100 ease-out origin-bottom-right`)),
                      enterFrom: cx(css(tw`transform scale-95 opacity-0`)),
                      enterTo: cx(css(tw`transform scale-100 opacity-100`)),
                      leave: cx(css(tw`transition duration-75 ease-out origin-bottom-right`)),
                      leaveFrom: cx(css(tw`transform scale-100 opacity-100`)),
                      leaveTo: cx(css(tw`transform scale-95 opacity-0`)),
                    }}
                  >
                    <Menu.Items css={[
                      tw`absolute text-lg -right-1 bottom-7 bg-white text-black border border-gray-200 rounded-lg px-1 shadow flex flex-col divide-y divide-gray-200 dark:(bg-gray-900 border-gray-700 divide-gray-700 text-gray-100)`
                    ]} static>
                      <div css={tw`py-1 w-full`}>
                        <Menu.Item as="div">
                          <button onClick={() => changeDarkmode('dark')} css={[tw`flex items-center gap-2 hover:bg-gray-200 rounded-lg transition duration-200 px-2 w-full dark:hover:bg-gray-700`]}>
                            <HiOutlineMoon />
                            <span>Dunkel</span>
                          </button>
                        </Menu.Item>
                        <Menu.Item as="div">
                          <button onClick={() => changeDarkmode('light')} css={[tw`flex items-center gap-2 hover:bg-gray-200 rounded-lg transition duration-200 px-2 w-full dark:hover:bg-gray-700`]}>
                            <HiOutlineSun />
                            <span>Hell</span>
                          </button>
                        </Menu.Item>
                      </div>
                      <div css={tw`py-1 w-full`}>
                        <Menu.Item as="div">
                          <button onClick={() => changeDarkmode('system')} css={[tw`flex items-center gap-2 hover:bg-gray-200 rounded-lg transition duration-200 px-2 w-full dark:hover:bg-gray-700`]}>
                            <HiOutlineDesktopComputer />
                            <span>System</span>
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
      <Transition
        as={Fragment}
        show={viewMore}
        {...{
          enter: cx(css(tw`transition-all duration-200 ease-out overflow-hidden`)),
          enterFrom: cx(css(tw`h-0 opacity-0`)),
          enterTo: cx(css(tw`h-6 opacity-100`)),
          leave: cx(css(tw`transition-all duration-200 ease-out overflow-hidden`)),
          leaveFrom: cx(css(tw`h-6 opacity-100`)),
          leaveTo: cx(css(tw`h-0 opacity-0`)),
        }}
      >
        <div css={tw`flex gap-2 text-gray-500 flex-wrap justify-center`}>
          {
            footerItems.map((item, i) => (
              <Link href={item.href} passHref key={i}>
                <a href={item.href} onClick={() => setViewMore(false)}>
                  {item.title}
                </a>
              </Link>
            ))
          }
        </div>
      </Transition>
    </>
  )
}

export default Footer
