import tw from 'twin.macro'
import { shootConfettiCorner } from '@/lib/confetti'

const FallbackPage = () => {
  return (
    <div css={tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl`} onClick={() => shootConfettiCorner()}>
      <span css={tw`whitespace-nowrap animate-pulse`}>
        Loading...
      </span>
    </div>
  )
}

export default FallbackPage