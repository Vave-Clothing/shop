import React, { useEffect, useRef } from 'react'
import tw from 'twin.macro'

interface formFieldTextareaProps {
  placeholder?: string
  disabled?: boolean
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  error?: boolean
}

const FormFieldTextarea = ({ placeholder, disabled, value, onChange, error }: formFieldTextareaProps) => {
  const inputField = useRef<HTMLTextAreaElement>(null)

  const handleResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const element = e.currentTarget
    element.setAttribute('style', 'height: auto;')
    element.setAttribute('style', `height: ${element.scrollHeight}px;`)
  }

  useEffect(() => {
    inputField.current?.setAttribute('style', 'height: auto;')
    inputField.current?.setAttribute('style', `height: ${inputField.current?.scrollHeight}px;`)
  }, [inputField])
  

  return (
    <div css={[
      tw`border first:rounded-l-lg last:rounded-r-lg px-3 py-1 w-full transition duration-200`,
      disabled ? tw`border-gray-100 cursor-not-allowed dark:border-gray-800` :
      error ? tw`border-red-200 hover:border-red-300 focus-within:border-red-500 dark:(border-red-700 hover:border-red-600 focus-within:border-red-400)` :
      tw`border-gray-200 hover:border-gray-300 focus-within:border-gray-500 dark:(border-gray-700 hover:border-gray-600 focus-within:border-gray-400)`
    ]}>
      <textarea
        css={[
          tw`bg-transparent w-full focus:outline-none placeholder:text-gray-500 text-gray-900 disabled:(cursor-not-allowed placeholder:text-gray-300 text-gray-500) dark:(text-gray-200 disabled:(placeholder:text-gray-600))`,
          tw`resize-none overflow-auto`
        ]}
        placeholder={placeholder}
        onInput={(e) => handleResize(e)}
        disabled={disabled}
        value={value}
        onChange={onChange}
        ref={inputField}
        rows={1}
      />
    </div>
  )
}

export default FormFieldTextarea