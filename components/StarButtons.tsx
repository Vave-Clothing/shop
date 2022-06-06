import { HiOutlineStar } from 'react-icons/hi'
import tw, { theme } from 'twin.macro'

interface starButtonsProps {
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
}

const StarButtons = ({ value, setValue }: starButtonsProps) => {
  const changeValue = (i: number) => {
    const value = i + 1
    setValue(value)
  }

  return (
    <div css={tw`flex gap-1 text-xl`}>
      {[...new Array(value)].map((_, i) => (
        <button onClick={() => changeValue(i)} key={i}>
          <HiOutlineStar fill={theme`colors.yellow.400`} color={theme`colors.yellow.400`} />
        </button>
      ))}
      {[...new Array(5 - value)].map((_, i) => (
        <button onClick={() => changeValue(i + value)} key={i}>
          <HiOutlineStar color={theme`colors.yellow.400`} />
        </button>
      ))}
    </div>
  )
}

export default StarButtons