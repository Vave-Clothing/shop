import type { NextPage } from 'next'
import tw, { theme } from 'twin.macro'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HiOutlineCheck, HiOutlineX, HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { useShoppingCart } from 'use-shopping-cart'
import Link from 'next/link'
import { shootFireworks } from '@/lib/confetti'
import { formatPrice } from '@/lib/priceFormatter'

const Success: NextPage = () => {
  const { query: { pid, platform } } = useRouter()
  const { clearCart } = useShoppingCart()
  const [statusComplete, setStatusComplete] = useState(false)

  const { data, error } = useSWR('/api/get_session/' + platform + '?id=' + pid, fetcher)

  useEffect(() => {
    if(statusComplete !== false) return
    clearCart()
    shootFireworks()
    setStatusComplete(true)
  }, [data, clearCart, statusComplete])

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
                {
                  data.status === 'paid' ? (
                    <span>Wir bearbeiten jetzt deine Bestellung im Wert von <span css={tw`font-semibold`}>EUR { formatPrice(data?.total_price) }</span></span>
                  ) : (
                    <span>Wir werden deine Bestellung im Wert von <span css={tw`font-semibold`}>EUR { formatPrice(data?.total_price) }</span> bei Eingang der Zahlung bearbeiten</span>
                  )
                }
              </div>
              <div css={tw`text-sm md:text-base`}>
                <span>Eine bestätigung wurde an <b>{ data.email.replace(/\*/g, '·') }</b> gesendet</span>
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