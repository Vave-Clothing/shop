import { HiOutlineCheck } from 'react-icons/hi'
import tw from 'twin.macro'

interface checkboxProps {
  checked: boolean
}

const Checkbox = ({ checked }: checkboxProps) => {
  return (
    <div css={[
      tw`inline-flex mr-1 w-4 h-4 border rounded justify-center items-center text-white transition duration-200`,
      checked ? tw`bg-black border-black` : tw`bg-white border-gray-200`
    ]}>
      <HiOutlineCheck />
    </div>
  )
}

export default Checkbox