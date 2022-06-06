import type { NextPage } from 'next'
import tw, { theme, css } from 'twin.macro'

const Feature: NextPage = () => {
  return (
    <div css={[tw`height[ calc(100vh - 50px - 1.5rem - 32px) ] rounded grid grid-cols-2 grid-rows-1`, css`background: linear-gradient(95deg, ${theme`colors.primary.400`} 0%, ${theme`colors.primary.400`} 50%, ${theme`colors.primary.800`} 50%, ${theme`colors.primary.800`} 100%)`]}>
      <div>a</div>
      <div>b</div>
    </div>
  )
}

export default Feature