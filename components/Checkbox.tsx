import { HiOutlineCheck } from 'react-icons/hi'
import tw from 'twin.macro'

interface checkboxProps {
  checked: boolean
}

const Checkbox = ({ checked }: checkboxProps) => {
  return (
    <div css={[
      tw`inline-flex mr-1 w-4 h-4 border rounded justify-center items-center text-white transition duration-200 dark:text-gray-100`,
      checked ? tw`bg-black border-black dark:(bg-gray-100 border-gray-100)` : tw`bg-white border-gray-200 dark:(bg-gray-900 border-gray-900)`
    ]}>
      <HiOutlineCheck />
    </div>
  )
}

export default Checkbox