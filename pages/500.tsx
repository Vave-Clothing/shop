import tw from 'twin.macro'
import { shootConfettiCorner } from '@/lib/confetti'

export default function Custom500() {
  return (
    <div css={tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl`} onClick={() => shootConfettiCorner()}>
      <span css={tw`pr-4 border-r border-gray-300`}>
        500
      </span>
      <span css={tw`pl-4 whitespace-nowrap`}>
        Internal Server Error
      </span>
    </div>
  )
}