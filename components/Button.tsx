import tw from 'twin.macro'
import ShimmerSvg from '@/assets/shimmer.svg'
import { CSSInterpolation } from '@emotion/css'

interface buttonProps {
  onClick(): any
  shimmering?: boolean
  type?: "primary" | "secondary"
  disabled?: boolean
  children: React.ReactChild
  adCss?: CSSInterpolation
  loading?: boolean
  size?: "small" | "medium" | "large"
}

const Button = ({ onClick, shimmering, type, disabled, children, adCss, loading, size }: buttonProps) => {
  return (
    <button
      css={[
        tw`rounded-lg mt-3 flex items-center justify-center gap-1 transition duration-200 relative overflow-hidden h-9 whitespace-nowrap border focus:outline-none`,
        size === "small" ? tw`px-3 py-1 shadow-sm focus-visible:ring-2` :
        size === "large" ? tw`px-4 py-2 font-medium text-xl shadow focus-visible:ring-3` :
        tw`px-4 py-1 font-medium text-lg shadow focus-visible:ring-3`,
        type === "primary" ? tw`bg-primary-500 border-primary-500 ring-primary-300 hover:(bg-primary-400 border-primary-400) active:(border-primary-600) text-white disabled:(bg-primary-400 border-primary-400 ring-primary-100 cursor-not-allowed)` :
        type === "secondary" ? tw`border-primary-500 ring-primary-300 text-current bg-transparent hover:(bg-primary-400 text-white border-primary-400) active:(border-primary-600) disabled:(border-primary-400 ring-primary-100 bg-transparent text-current cursor-not-allowed)` :
        tw`border-gray-200 ring-gray-400 hover:(border-gray-300) active:(border-gray-500) disabled:(border-gray-100 ring-gray-200 text-gray-500 cursor-not-allowed)`,
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
                  tw`flex-none w-full top-0 bottom-0 right-full absolute animate-shimmer flex items-center justify-center text-primary-200`,
                  type === "primary" ? tw`text-primary-200` :
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
              type === "primary" ? tw`border-primary-300 border-t-primary-100` :
              type === "secondary" ? tw`border-primary-200 border-t-primary-400` :
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