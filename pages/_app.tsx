import tw, { GlobalStyles } from 'twin.macro'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NavBar from '@/components/NavBar'
import PageContent from '@/components/PageContent'
import SideMenu from '@/components/SideMenu'
import { useState, useEffect } from 'react'
import getStripe from '@/lib/getStripeJs'
import { CartProvider } from 'use-shopping-cart'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [ menu, setMenu ] = useState(false)

  useEffect(() => {
    getStripe.name
  }, [])

  return (
    <>
      <CartProvider
        mode="payment"
        cartMode="client-only"
        stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
        currency="EUR"
        allowedCountries={['DE', 'CH', 'AT']}
      >
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
      </CartProvider>
    </>
  )
}

export default MyApp
