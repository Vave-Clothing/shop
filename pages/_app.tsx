import tw, { GlobalStyles, theme } from 'twin.macro'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NavBar from '@/components/NavBar'
import PageContent from '@/components/PageContent'
import SideMenu from '@/components/SideMenu'
import { useState, useEffect, useLayoutEffect } from 'react'
import getStripe from '@/lib/getStripeJs'
import { CartProvider } from 'use-shopping-cart'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import startsWith from '@/lib/startsWith'
import '@/styles/emoji.css'
import { SessionProvider } from 'next-auth/react'
import darkmode from '@/lib/darkmode'
import Footer from '@/components/Footer'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const [ menu, setMenu ] = useState(false)

  useEffect(() => {
    getStripe.name
  }, [])

  useLayoutEffect(() => {
    darkmode()
  }, [])

  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <CartProvider
            mode="payment"
            cartMode="client-only"
            stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
            currency="EUR"
            allowedCountries={['DE', 'CH', 'AT']}
          >
            <GlobalStyles />
            <Toaster
              reverseOrder={true}
              toastOptions={{
                success: {
                  iconTheme: {
                    primary: theme`colors.green.500`,
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: theme`colors.red.500`,
                    secondary: '#fff',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: theme`colors.gray.500`,
                    secondary: theme`colors.gray.200`,
                  },
                }
              }}
            />
            {
              router.pathname === '/' &&
              <Component {...pageProps} />
            }
            {
              router.pathname !== '/' &&
              <div css={tw`xl:(overflow-y-scroll h-screen)`} id="app">
                {
                  !startsWith(router.pathname, '/checkout') &&
                  <NavBar openMenu={setMenu} />
                }
                <SideMenu open={menu} close={setMenu} />
                <div css={[tw`flex flex-col w-full justify-between items-center`, !startsWith(router.pathname, '/checkout') ? tw`min-height[calc(100% - 3.125rem)]` : tw`min-height[100%]`]}>
                  <PageContent>
                    <Component {...pageProps} />
                  </PageContent>
                  <div css={tw`flex flex-col items-center w-full py-1`}>
                    <Footer />
                  </div>
                </div>
              </div>
            }
          </CartProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
