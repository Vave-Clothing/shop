import { CSSInterpolation } from '@emotion/css'
import tw from 'twin.macro'

interface formFieldButtonProps {
  onClick(): any
  disabled?: boolean
  children: React.ReactChild
  adCss?: CSSInterpolation
  loading?: boolean
}

const FormFieldButton = ({ children, onClick, disabled, adCss, loading }: formFieldButtonProps) => {
  return (
    <button
      css={[
        tw`flex justify-center items-center relative focus:outline-none first:rounded-l-lg last:rounded-r-lg px-3 py-1 transition duration-200 whitespace-nowrap focus-visible:ring-2`,
        tw`border border-gray-200 hover:(border-gray-300) active:(border-gray-500) ring-gray-400 disabled:(border-gray-100 ring-gray-200 text-gray-500 cursor-not-allowed)`,
        adCss ? adCss : tw``
      ]}
      onClick={() => onClick()}
      disabled={disabled || loading}
    >
      <div css={[
        tw`flex gap-1 justify-center items-center`,
        loading ? tw`invisible` : tw`visible`
      ]}>
        { children }
      </div>
      {
        loading &&
        <div css={tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
          <span
            css={[
              tw`block h-4 w-4 rounded-full border-2 animate-spin`,
              tw`border-gray-200 border-t-gray-400`
            ]}
          >
          </span>
        </div>
      }
    </button>
  )
}

export default FormFieldButton