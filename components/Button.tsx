import tw from 'twin.macro'
import ShimmerSvg from '@/assets/shimmer.svg'
import { CSSInterpolation } from '@emotion/css'

interface buttonProps {
  onClick: Function
  shimmering?: boolean
  type?: "primary" | "secondary"
  disabled?: boolean
  children: React.ReactChild
  adCss?: CSSInterpolation
  loading?: boolean
}

const Button = ({ onClick, shimmering, type, disabled, children, adCss, loading }: buttonProps) => {
  return (
    <button
      css={[
        tw`px-4 py-1 rounded-lg mt-3 flex items-center justify-center gap-1 text-lg transition duration-200 font-medium shadow relative overflow-hidden h-9 whitespace-nowrap`,
        type === "primary" ? tw`bg-indigo-500 hover:bg-indigo-400 text-white disabled:(bg-indigo-400 cursor-not-allowed)` :
        type === "secondary" ? tw`border border-indigo-500 hover:(bg-indigo-400 text-white border-indigo-400) disabled:(border-indigo-400 cursor-not-allowed)` :
        tw`border border-gray-200 hover:(border-gray-300) disabled:(border-gray-100 text-gray-500 cursor-not-allowed)`,
        adCss ? adCss : tw``
      ]}
      onClick={() => onClick()}
      disabled={disabled || loading}
    >
      {
        !loading ? (
          <>
            { children }
            {
              shimmering && !disabled &&
              <div
                css={[
                  tw`flex-none w-full top-0 bottom-0 right-full absolute animate-shimmer flex items-center justify-center text-indigo-200`,
                  type === "primary" ? tw`text-indigo-200` :
                  type === "secondary" ? tw`text-gray-400` :
                  tw`text-gray-400`,
                ]}
              >
                <ShimmerSvg />
              </div>
            }
          </>
        ) : (
          <span
            css={[
              tw`block h-4 w-4 rounded-full border-2 animate-spin`,
              type === "primary" ? tw`border-indigo-300 border-t-indigo-100` :
              type === "secondary" ? tw`border-indigo-200 border-t-indigo-400` :
              tw`border-gray-200 border-t-gray-400`
            ]}
          >
          </span>
        )
      }
      
    </button>
  )
}

export default Button