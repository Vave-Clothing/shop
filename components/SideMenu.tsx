import tw from 'twin.macro'
import { Dispatch, SetStateAction } from 'react'
import { HiOutlineX } from 'react-icons/hi'
import { Transition } from '@headlessui/react'
import { css, cx } from '@emotion/css'

interface sideMenuProps {
  open: boolean,
  close: Dispatch<SetStateAction<boolean>>
}

const SideMenu = ({ open, close }: sideMenuProps) => {
  return (
    <>
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
        <div css={tw`absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-10 hidden sm:block`} onClick={() => { close(false) }}></div>

        <div css={tw`absolute top-0 right-0 bg-gray-100 max-w-[40rem] w-full h-full py-4 px-6 border-l border-gray-200 transform`}>
          <div css={tw`flex justify-end items-center text-2xl mb-4`}>
            <span>
              <button onClick={() => { close(false) }}>
                <HiOutlineX />
              </button>
            </span>
          </div>
          <div css={tw`flex flex-col text-xl`}>
            <span>Produkte</span>
            <span>Login</span>
            <span>Einkaufswagen</span>
          </div>
        </div>
      </Transition>
    </>
  )
}

export default SideMenu