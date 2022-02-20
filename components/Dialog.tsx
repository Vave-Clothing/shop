import tw from 'twin.macro'
import { cx, css } from '@emotion/css'
import { Dialog as HUIDialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface dialogProps {
  show: boolean
  onClose(): void
  title?: string
  description?: string
  children: React.ReactChild
  width?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"
}

const Dialog = ({ show, onClose, title, description, children, width }: dialogProps) => {
  return (
    <Transition show={show} as={Fragment}>
      <HUIDialog onClose={onClose} css={tw`fixed z-50 inset-0 overflow-y-auto text-black dark:text-gray-100`}>
        <div css={tw`flex items-center justify-center min-h-screen`}>

          <Transition.Child
            as={Fragment}
            {...{
              enter: cx(css(tw`ease-out duration-300`)),
              enterFrom: cx(css(tw`opacity-0`)),
              enterTo: cx(css(tw`opacity-100`)),
              leave: cx(css(tw`ease-in duration-200`)),
              leaveFrom: cx(css(tw`opacity-100`)),
              leaveTo: cx(css(tw`opacity-0`)),
            }}
          >
            <HUIDialog.Overlay css={tw`fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-40`} />
          </Transition.Child>


          <Transition.Child
            as={Fragment}
            {...{
              enter: cx(css(tw`ease-out duration-300`)),
              enterFrom: cx(css(tw`opacity-0 scale-95`)),
              enterTo: cx(css(tw`opacity-100 scale-100`)),
              leave: cx(css(tw`ease-in duration-200`)),
              leaveFrom: cx(css(tw`opacity-100 scale-100`)),
              leaveTo: cx(css(tw`opacity-0 scale-95`)),
            }}
          >
            <div css={[
              tw`relative bg-white dark:bg-gray-900 rounded-lg mx-1 py-3 px-5 shadow-lg w-full`,
              width === "5xl" ? tw`max-w-5xl` :
              width === "4xl" ? tw`max-w-4xl` :
              width === "3xl" ? tw`max-w-3xl` :
              width === "2xl" ? tw`max-w-2xl` :
              width === "xl" ? tw`max-w-xl` :
              width === "lg" ? tw`max-w-lg` :
              tw`max-w-md`
            ]}>
              {
                title &&
                <HUIDialog.Title css={tw`text-xl font-semibold`}>{title}</HUIDialog.Title>
              }
              {
                description &&
                <HUIDialog.Description css={tw`font-light mb-4`}>{description}</HUIDialog.Description>
              }
              <div css={title || description ? tw`mt-4` : tw``}>
                { children }
              </div>
            </div>
          </Transition.Child>
        </div>
      </HUIDialog>
    </Transition>
  )
}

export default Dialog