import { MouseEventHandler, useEffect, useState } from 'react'
import { HiOutlineCheck } from 'react-icons/hi'
import tw from 'twin.macro'

interface formCheckboxProps {
  value: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  title: string
  description?: React.ReactChild
  disabled?: boolean
  error?: string
}

const FormCheckbox = ({ value, onClick, title, description, disabled, error }: formCheckboxProps) => {
  const [currentError, setCurrentError] = useState('error')

  useEffect(() => {
    if(error) {
      setCurrentError(error)
    }
  }, [error])
  
  return (
    <div>
      <div css={tw`flex gap-2`}>
        <button css={[
          tw`flex w-6 h-6 items-center justify-center focus:outline-none transition duration-200 focus-visible:ring-2 rounded-lg my-1 flex-shrink-0 border disabled:(text-gray-500 cursor-not-allowed)`,
          error ? tw`border-red-200 ring-red-400 disabled:(border-red-100 ring-red-200) dark:(border-red-700 ring-red-500 disabled:(border-red-800 ring-red-700))` :
          tw`border-gray-200 hover:(border-gray-300) active:(border-gray-500) ring-gray-400 disabled:(border-gray-100 ring-gray-200) dark:(border-gray-700 hover:border-gray-600 active:border-gray-400 ring-gray-500 disabled:(border-gray-800 ring-gray-700))`
        ]} onClick={onClick} disabled={disabled}>
          <span css={[
            tw`text-black transition duration-200 dark:text-gray-100`,
            value ? tw`opacity-100` : tw`opacity-0`
          ]}>
            <HiOutlineCheck />
          </span>
        </button>
        <div>
          <p css={tw``}>{title}</p>
          <p css={tw`text-sm font-light`}>{description}</p>
        </div>
      </div>
      <span css={[
        tw`text-red-600 dark:text-red-400 text-xs font-light transform block transition duration-300`,
        error ? tw`-translate-y-0 opacity-100` : tw` -translate-y-1/2 opacity-0`
      ]}>{currentError}</span>
    </div>
  )
}

export default FormCheckbox