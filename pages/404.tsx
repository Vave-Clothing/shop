import tw from 'twin.macro'

export default function Custom404() {
  return (
    <div css={tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl`}>
      <span css={tw`pr-4 border-r border-gray-300`}>
        404
      </span>
      <span css={tw`pl-4`}>
        Page Not Found
      </span>
    </div>
  )
}