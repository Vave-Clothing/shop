import type { NextPage } from 'next'
import { HiOutlineArrowNarrowRight, HiOutlineMinus, HiOutlinePlus, HiOutlineX } from 'react-icons/hi'
import tw from 'twin.macro'
import { useShoppingCart } from 'use-shopping-cart'
import capitalizeFirstLetter from '@/lib/capitalizeFirstLetter'
import Link from 'next/link'

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const Cart: NextPage = () => {
  const { cartDetails, clearCart, incrementItem, decrementItem, removeItem, totalPrice } = useShoppingCart()

  const cart = Object.keys(cartDetails).map((key) => {
    const { id, quantity, image, name, price, size, value } = cartDetails[key]
    return { priceId: id, quantity, image, name, price, size, value }
  })

  console.log(cart);
  

  return (
    <div>
      <h1 css={tw`text-4xl font-semibold mt-3 mb-2`}>
        Einkaufswagen
      </h1>
      <div>
        {
          cart.map((i:any) => (
            <div css={tw`border-b border-gray-200 py-3 px-4 flex justify-between items-center`} key={i.priceId}>
              <div css={tw`flex flex-col`}>
                <span css={tw`text-xl font-medium leading-tight`}>{i.name}</span>
                <span css={tw`leading-tight`}>Größe: { capitalizeFirstLetter(i.size) }</span>
              </div>
              <div css={tw`flex items-center gap-4`}>
                <div css={tw`flex`}>
                  <button
                    css={tw`w-8 h-8 hover:bg-red-200 hover:text-red-500 rounded flex items-center justify-center transition duration-200 disabled:cursor-not-allowed disabled:hover:bg-red-50`}
                    disabled={ i.quantity < 2 }
                    onClick={() => decrementItem(i.priceId)}
                  >
                    <HiOutlineMinus />
                  </button>
                  <span css={tw`w-8 h-8 flex items-center justify-center`}>{ i.quantity }</span>
                  <button
                    css={tw`w-8 h-8 hover:bg-green-200 hover:text-green-500 rounded flex items-center justify-center transition duration-200`}
                    onClick={() => incrementItem(i.priceId)}
                  >
                    <HiOutlinePlus />
                  </button>
                </div>
                <div css={tw`flex items-center justify-center`}>
                  <span css={tw`flex flex-col items-center justify-center text-sm`}>
                    <span>x EUR { priceFormatter.format(i.price / 100) }</span>
                    <span css={tw`text-xs`}>EUR { priceFormatter.format(i.value / 100) }</span>
                  </span>
                  <button
                    css={tw`w-8 h-8 hover:text-red-500 rounded flex items-center justify-center transition duration-200`}
                    onClick={() => removeItem(i.priceId)}
                  >
                    <HiOutlineX />
                  </button>
                </div>
              </div>
            </div>
          ))
        }
        {
          cart.length < 1 &&
          <div css={tw`border-b border-gray-200 py-3 px-4 flex items-center gap-4`}>
            <span css={tw`text-xl font-medium`}>Keine Gegenstände im Einkaufswagen</span>
            <span css={tw`text-indigo-500 hover:text-indigo-400 transition duration-200`}>
              <Link href="/shop" passHref>
                <a href="/shop" css={tw`flex items-center gap-1`}>
                  <span>Einkaufen</span>
                  <HiOutlineArrowNarrowRight />
                </a>
              </Link>
            </span>
          </div>
        }
        <div css={tw`flex items-end justify-center mt-4 flex-col`}>
          <span>
            <span css={tw`mr-4`}>Zwischensumme</span>
            <span css={tw`text-xl font-medium`}>
              EUR { priceFormatter.format(totalPrice / 100) }
            </span>
          </span>
          <span>
            <span css={tw`mr-4`}>Lieferung</span>
            <span css={tw`text-xl font-medium`}>
              EUR { priceFormatter.format(0) }
            </span>
          </span>
          <span>
            <span css={tw`mr-4 text-lg`}>Gesamt (inkl. MwSt)</span>
            <span css={tw`text-2xl font-semibold`}>
              EUR { priceFormatter.format(totalPrice / 100) }
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Cart