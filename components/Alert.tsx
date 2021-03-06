import { HiOutlineBell, HiOutlineCheck, HiOutlineExclamation, HiOutlineInformationCircle, HiOutlineXCircle } from 'react-icons/hi'
import tw from 'twin.macro'

interface alertProps {
  title: string
  description: string
  type?: "info" | "success" | "caution" | "critical"
}

const Alert = ({ title, description, type }: alertProps) => {
  return (
    
    <div css={[
      tw`shadow flex gap-4 px-5 py-2 rounded-lg border`,
      type === "info" ? tw`border-blue-300 bg-blue-100 text-blue-900 dark:(border-blue-600 bg-blue-800 text-blue-100)` :
      type === "success" ? tw`border-green-300 bg-green-100 text-green-900 dark:(border-green-600 bg-green-800 text-green-100)` :
      type === "caution" ? tw`border-yellow-300 bg-yellow-100 text-yellow-900 dark:(border-yellow-600 bg-yellow-800 text-yellow-100)` :
      type === "critical" ? tw`border-red-300 bg-red-100 text-red-900 dark:(border-red-600 bg-red-900 text-red-100)` :
      tw`border-gray-300 bg-gray-100 dark:(border-gray-600 bg-gray-800)`
    ]}>
      <div css={tw`text-lg py-[.3rem]`}>
        {(() => {
          switch (type) {
            case 'info':
              return (
                <HiOutlineInformationCircle />
              )
            case 'success':
              return (
                <HiOutlineCheck />
              )
            case 'caution':
              return (
                <HiOutlineExclamation />
              )
            case 'critical':
              return (
                <HiOutlineXCircle />
              )
            default:
              return(
                <HiOutlineBell />
              )
          }
        })()}
      </div>
      <div css={tw`flex flex-col`}>
        <span css={tw`text-lg font-medium`}>{ title }</span>
        <span css={tw`text-sm`}>{ description }</span>
      </div>
    </div>
  )
}

export default Alert