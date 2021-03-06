import React, { useRef } from 'react'
import tw from 'twin.macro'

interface formFieldProps {
  prependIcon?: React.ReactChild
  appendIcon?: React.ReactChild
  placeholder?: string
  disabled?: boolean
  onEnter?(): any
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  error?: boolean
  autocomplete?: "off" | "on" | "email" | "given-name" | "family-name" | "username" | "name"
}

const FormField = ({ prependIcon, appendIcon, placeholder, disabled, onEnter, value, onChange, error, autocomplete }: formFieldProps) => {
  const inputField = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key !== 'Enter') return
    if(onEnter) return onEnter()
  }

  return (
    <div css={[
      tw`border first:rounded-l-lg last:rounded-r-lg px-3 py-1 w-full transition duration-200`,
      disabled ? tw`border-gray-100 cursor-not-allowed dark:border-gray-800` :
      error ? tw`border-red-200 hover:border-red-300 focus-within:border-red-500 dark:(border-red-700 hover:border-red-600 focus-within:border-red-400)` :
      tw`border-gray-200 hover:border-gray-300 focus-within:border-gray-500 dark:(border-gray-700 hover:border-gray-600 focus-within:border-gray-400)`
    ]}>
      <div css={tw`flex gap-2`}>
        {
          prependIcon &&
          <div css={[
            tw`text-lg flex items-center`,
            disabled ? tw`text-gray-400 dark:text-gray-500` : tw`text-gray-600 dark:text-gray-300`
          ]} onClick={() => inputField.current?.focus()}>{ prependIcon }</div>
        }
        <input
          type={autocomplete === 'email' ? 'email' : 'text'}
          css={tw`bg-transparent w-full focus:outline-none placeholder:text-gray-500 text-gray-900 disabled:(cursor-not-allowed placeholder:text-gray-300 text-gray-500) dark:(text-gray-200 disabled:(placeholder:text-gray-600))`}
          placeholder={placeholder}
          onKeyDown={(e) => handleKeyDown(e)}
          disabled={disabled}
          value={value}
          onChange={onChange}
          ref={inputField}
          autoComplete={autocomplete}
        />
        {
          appendIcon &&
          <div css={[
            tw`text-lg flex items-center`,
            disabled ? tw`text-gray-400 dark:text-gray-500` : tw`text-gray-600 dark:text-gray-300`
          ]} onClick={() => inputField.current?.focus()}>{ appendIcon }</div>
        }
      </div>
    </div>
  )
}

export default FormField