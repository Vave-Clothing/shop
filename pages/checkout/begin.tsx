import type { NextPage } from 'next'
import tw from 'twin.macro'
import { useShoppingCart } from 'use-shopping-cart'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/priceFormatter'
import Button from '@/components/Button'
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { useRouter } from 'next/router'
import CheckoutTitle from '@/components/CheckoutTitle'

const Begin: NextPage = () => {
  const { cartDetails, totalPrice } = useShoppingCart()
  const router = useRouter()

  const cart = Object.keys(cartDetails).map((key) => {
    const { id, quantity, image, imageLQIP, name, price, size, value, stock, url } = cartDetails[key]
    return { priceId: id, quantity, image, imageLQIP, name, price, size, value, stock, url }
  })

  return (
    <div css={tw`my-4`}>
      <CheckoutTitle router={router} />
      <h2 css={tw`text-2xl font-semibold mt-6 mb-4`}>Überprüfe noch einmal Deine Bestellung</h2>
      {
        cart.map((i:any) => (
          <div css={tw`border-b border-gray-200 py-3 px-4 flex sm:(justify-between items-center flex-row gap-1) flex-col gap-3`} key={i.priceId}>
            <div css={tw`flex items-center gap-2`}>
              <div css={tw`relative w-12 h-12 rounded overflow-hidden`}>
                <Image src={i.image} layout="fill" objectFit="cover" alt={i.name} placeholder="blur" blurDataURL={i.imageLQIP} />
              </div>
              <div>
                <Link href={i.url} passHref>
                  <a href={i.url} css={tw`flex flex-col`}>
                    <span css={tw`text-xl font-medium leading-tight`}>{i.name}</span>
                    <span css={tw`leading-tight`}>Größe: { i.size.toUpperCase() }</span>
                  </a>
                </Link>
              </div>
            </div>
            <div css={tw`flex items-center gap-6 sm:justify-start justify-between`}>
              <div css={tw`flex items-center`}>
                <span css={tw`w-8 h-8 flex items-center justify-center`}>{ i.quantity }</span>
                <span css={tw`text-sm`}>x EUR { formatPrice(i.price / 100) }</span>
              </div>
              <div css={tw`flex items-center justify-center`}>
                <span>EUR { formatPrice(i.value / 100) }</span>
              </div>
            </div>
          </div>
        ))
      }
      <div css={tw`flex items-end justify-center mt-3 flex-col lg:min-width[22rem]`}>
        <span>
          <span css={tw`mr-4`}>Zwischensumme</span>
          <span css={tw`sm:text-xl text-lg font-medium`}>
            EUR { formatPrice(totalPrice / 100) }
          </span>
        </span>
        <span>
          <span css={tw`mr-4`}>Lieferung<sup>*</sup></span>
          <span css={tw`sm:text-xl text-lg font-medium`}>
            EUR { formatPrice(0) }
          </span>
        </span>
        <span>
          <span css={tw`mr-4 sm:text-lg`}>Gesamt<sup>*</sup></span>
          <span css={tw`sm:text-2xl text-xl font-semibold`}>
            EUR { formatPrice(totalPrice / 100) }
          </span>
        </span>
        <span css={tw`text-gray-500 text-sm mt-2`}>* wird im nächsten Schritt berechnet</span>
        <div css={tw`mt-2 max-w-md w-full flex gap-4`}>
          <Button onClick={() => router.push('/cart')} adCss={tw`w-full`}>
            <>
              <HiOutlineArrowNarrowLeft />
              <span>Zurück</span>
            </>
          </Button>
          <Button onClick={() => router.push('/checkout/shipping')} adCss={tw`w-full`} type='primary'>
            <>
              <span>Weiter</span>
              <HiOutlineArrowNarrowRight />
            </>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Begin