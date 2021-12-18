import type { NextPage } from 'next'
import tw, { theme } from 'twin.macro'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { HiOutlineCheck, HiOutlineX, HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { useShoppingCart } from 'use-shopping-cart'
import Link from 'next/link'
import { shootFireworks } from '@/lib/confetti'

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const Success: NextPage = () => {
  const { query: { sid } } = useRouter()
  const { clearCart } = useShoppingCart()

  const { data, error } = useSWR('/api/get_session/stripe?id=' + sid, fetcher)

  useEffect(() => {
    if(data?.status === 'complete') {
      clearCart()
      shootFireworks()
    }
  }, [data, clearCart])

  return (
    <div css={tw`flex items-center flex-col gap-3`}>
      <div css={tw`flex flex-col items-center bg-gray-100 rounded-xl py-7 px-6 shadow-sm gap-4 md:gap-0`}>
        {
          error ? (
            <div css={tw`flex items-center gap-2 md:text-2xl text-xl`}>
              <HiOutlineX color={theme('colors.red.500')} />
              <span>Etwas ist schief gelaufen</span>
            </div>
          ) : !data ? (
            <div css={tw`flex items-center gap-2 md:text-2xl text-xl`}>
              <span css={tw`block w-6 h-6 border-3 border-yellow-200 border-t-yellow-400 rounded-full animate-spin`}></span>
              <span>Lädt...</span>
            </div>
          ) : (
            <>
              <div css={tw`flex items-center gap-2 md:text-2xl text-xl`}>
                <HiOutlineCheck color={theme('colors.green.500')} />
                <span>Danke für deinen Einkauf 🤝</span>
              </div>
              <div css={tw`md:text-lg`}>
                <span>Wir bearbeiten jetzt deine Bestellung im Wert von <span css={tw`font-semibold`}>EUR { priceFormatter.format(data?.amount_total / 100) }</span></span>
              </div>
            </>
          )
        }
      </div>
      <span css={tw`text-indigo-500 hover:text-indigo-400 transition duration-200`}>
        <Link href="/shop" passHref>
          <a href="/shop" css={tw`flex items-center gap-1`}>
            <span>Zurück zum Shop</span>
            <HiOutlineArrowNarrowRight />
          </a>
        </Link>
      </span>
    </div>
  )
}

export default Success