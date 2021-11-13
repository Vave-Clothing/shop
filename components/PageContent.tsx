import tw from 'twin.macro'
import { ReactElement } from 'react'

interface pageContentProps {
  children: ReactElement<any, any>
}

const PageContent = ({ children }: pageContentProps) => {
  return (
    <div css={tw`w-full flex justify-center items-center`}>
      <div css={tw`max-w-[96rem] w-full px-6 py-3`}>
        { children }
      </div>
    </div>
  )
}

export default PageContent