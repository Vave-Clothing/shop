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
      color === 'blue' ? tw`bg-blue-200 text-blue-600 dark:(bg-blue-700 text-blue-300)` :
      color === 'green' ? tw`bg-green-200 text-green-600 dark:(bg-green-700 text-green-200)` :
      color === 'red' ? tw`bg-red-200 text-red-700 dark:(bg-red-700 text-red-200)` :
      color === 'yellow' ? tw`bg-yellow-300 text-yellow-700 dark:(bg-yellow-600 text-yellow-100)` :
      tw`bg-gray-200 text-gray-600 dark:(bg-gray-700 text-gray-300)`
    ]}>
      {
        dot &&
        <span css={[
          tw`block w-2 h-2 rounded-full flex-shrink-0`,
          color === 'blue' ? tw`bg-blue-500 dark:bg-blue-400` :
          color === 'green' ? tw`bg-green-500 dark:bg-green-300` :
          color === 'red' ? tw`bg-red-600 dark:bg-red-300` :
          color === 'yellow' ? tw`bg-yellow-600 dark:bg-yellow-200` :
          tw`bg-gray-500 dark:bg-gray-400`
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