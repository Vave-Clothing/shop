import { useState, useEffect } from 'react'
import tw from 'twin.macro'

interface formFieldWrapperProps {
  children: React.ReactChild
  title?: string
  error?: string
}

const FormFieldWrapper = ({ children, title, error }: formFieldWrapperProps) => {
  const [currentError, setCurrentError] = useState('error')

  useEffect(() => {
    if(error) {
      setCurrentError(error)
    }
  }, [error])

  return (
    <div>
      {
        title &&
        <span css={tw`text-gray-600 dark:text-gray-300 text-sm font-light`}>{ title }</span>
      }
      <div css={tw`flex`}>
        { children }
      </div>
      <span css={[
        tw`text-red-600 dark:text-red-400 text-xs font-light transform block transition duration-300`,
        error ? tw`-translate-y-0 opacity-100` : tw` -translate-y-1/2 opacity-0`
      ]}>{currentError}</span>
    </div>
  )
}

export default FormFieldWrapper