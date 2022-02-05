import tw from 'twin.macro'

interface chipProps {
  text?: string
  color: "green" | "yellow" | "red" | "blue" | "gray"
  dot?: boolean
}

const Chip = ({ text, color, dot }: chipProps) => {
  return (
    <span css={[
      tw`inline-flex px-1.5 rounded items-center gap-1 h-6`,
      color === 'blue' ? tw`bg-blue-200 text-blue-600` :
      color === 'green' ? tw`bg-green-200 text-green-600` :
      color === 'red' ? tw`bg-red-200 text-red-700` :
      color === 'yellow' ? tw`bg-yellow-300 text-yellow-700` :
      tw`bg-gray-200 text-gray-600`
    ]}>
      {
        dot &&
        <span css={[
          tw`block w-2 h-2 rounded-full flex-shrink-0`,
          color === 'blue' ? tw`bg-blue-500` :
          color === 'green' ? tw`bg-green-500` :
          color === 'red' ? tw`bg-red-600` :
          color === 'yellow' ? tw`bg-yellow-600` :
          tw`bg-gray-500`
        ]} />
      }
      {
        text &&
        <span>{text}</span>
      }
    </span>
  )
}

export default Chip