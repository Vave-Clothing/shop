import { CSSInterpolation } from '@emotion/css'
import tw from 'twin.macro'

interface iconButtonsProps {
  onClick(): any
  disabled?: boolean
  icon: React.ReactChild
  adCss?: CSSInterpolation
  loading?: boolean
}

const IconButton = ({ onClick, disabled, icon, adCss, loading }: iconButtonsProps) => {
  return (
    <button
      css={[
        tw`flex justify-center items-center relative focus:outline-none rounded-full p-2 w-8 h-8 transition duration-200 whitespace-nowrap focus-visible:ring-2`,
        tw`border border-gray-200 hover:(border-gray-300) active:(border-gray-500) ring-gray-400 disabled:(border-gray-100 ring-gray-200 text-gray-500 cursor-not-allowed)`,
        adCss ? adCss : tw``
      ]}
      onClick={() => onClick()}
      disabled={disabled || loading}
    >
      <div css={[
        tw`flex justify-center items-center`,
        loading ? tw`invisible` : tw`visible`
      ]}>
        { icon }
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

export default IconButton