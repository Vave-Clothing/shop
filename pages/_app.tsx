import tw, { GlobalStyles } from 'twin.macro'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NavBar from '@/components/NavBar'
import PageContent from '@/components/PageContent'
import SideMenu from '@/components/SideMenu'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [ menu, setMenu ] = useState(false)

  return (
    <>
      <GlobalStyles />
      {
        router.pathname === '/' &&
        <Component {...pageProps} />
      }
      {
        router.pathname !== '/' &&
        <div css={tw`overflow-y-scroll h-screen`}>
          <NavBar openMenu={setMenu} />
          <SideMenu open={menu} close={setMenu} />
          <PageContent>
            <Component {...pageProps} />
          </PageContent>
        </div>
      }
    </>
  )
}

export default MyApp
