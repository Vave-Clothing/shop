import type { NextPage } from 'next'
import { HiOutlineArrowNarrowRight, HiOutlineCreditCard, HiOutlineMinus, HiOutlinePlus, HiOutlineX } from 'react-icons/hi'
import tw from 'twin.macro'
import { useShoppingCart } from 'use-shopping-cart'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useRef, useState, useEffect } from 'react'
import ShimmerSvg from '@/assets/shimmer.svg'
import axios from 'axios'

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const Cart: NextPage = () => {
  const rightPanel = useRef<HTMLDivElement>(null)
  const [rightPanelTop, setRightPanelTop] = useState(0)
  const [allowSticky, setAllowSticky] = useState(false)
  const { cartDetails, clearCart, incrementItem, decrementItem, removeItem, totalPrice, cartCount } = useShoppingCart()
  const [loadingSession, setLoadingSession] = useState(false)

  const cart = Object.keys(cartDetails).map((key) => {
    const { id, quantity, image, imageLQIP, name, price, size, value, stock, url } = cartDetails[key]
    return { priceId: id, quantity, image, imageLQIP, name, price, size, value, stock, url }
  })

  const emptyCart = () => {
    toast.promise(
      clearCart(),
      {
        loading: 'Produkte werden entfernt...',
        success: 'Alles entfernt',
        error: 'Da hat etwas nicht geklappt'
      }
    )
  }

  const getRightPanelTopPosition = () => {
    const rect = rightPanel.current?.getBoundingClientRect()
    return rect?.top
  }

  const buyCart = async () => {
    setLoadingSession(true)
    const data = await axios.post('/api/checkout_sessions/stripe', { cart: cartDetails }).then(res => res.data)
    setLoadingSession(false)
    window.location = data.url
  }

  useEffect(() => {
    var timeout: any = undefined
  
    const handleResize = () => {
      setAllowSticky(false)
      setRightPanelTop(Number(getRightPanelTopPosition()))
      setAllowSticky(true)
    }

    window.addEventListener('resize', () => {
      clearTimeout(timeout)
      timeout = setTimeout(handleResize, 100)
    })
  }, [])

  return (
    <div>
      <h1 css={tw`text-4xl font-semibold mt-3 mb-2 sm:text-left text-center`}>
        Einkaufswagen
      </h1>
      <div css={tw`flex gap-4 lg:flex-row flex-col`}>
        <div css={tw`flex-grow`}>
          {
            cart.map((i:any) => (
              <div css={tw`border-b border-gray-200 py-3 px-4 flex sm:justify-between sm:items-center sm:flex-row flex-col sm:gap-1 gap-3`} key={i.priceId}>
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
                <div css={tw`flex items-center gap-4 sm:justify-start justify-between`}>
                  <div css={tw`flex`}>
                    <button
                      css={tw`w-8 h-8 hover:bg-red-200 hover:text-red-500 rounded flex items-center justify-center transition duration-200 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-red-400 disabled:hover:bg-red-50`}
                      disabled={ i.quantity < 2 }
                      onClick={() => decrementItem(i.priceId)}
                    >
                      <HiOutlineMinus />
                    </button>
                    <span css={tw`w-8 h-8 flex items-center justify-center`}>{ i.quantity }</span>
                    <button
                      css={tw`w-8 h-8 hover:bg-green-200 hover:text-green-500 rounded flex items-center justify-center transition duration-200 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-green-400 disabled:hover:bg-green-50`}
                      disabled={ i.quantity >= i.stock }
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
                      onClick={() => removeItem(id)}
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
        </div>
        <div css={tw`lg:border-l border-gray-200 lg:pl-3`}>
          <div css={[tw`flex flex-col-reverse lg:flex-col`, allowSticky ? tw`lg:sticky` : tw``]} ref={rightPanel} style={{ top: rightPanelTop }}>
            <div css={tw`flex items-end justify-center mt-3 flex-col lg:min-width[22rem]`}>
              <span>
                <span css={tw`mr-4`}>Zwischensumme</span>
                <span css={tw`sm:text-xl text-lg font-medium`}>
                  EUR { priceFormatter.format(totalPrice / 100) }
                </span>
              </span>
              <span>
                <span css={tw`mr-4`}>Lieferung</span>
                <span css={tw`sm:text-xl text-lg font-medium`}>
                  EUR { priceFormatter.format(0) }
                </span>
              </span>
              <span>
                <span css={tw`mr-4 sm:text-lg`}>Gesamt (inkl. MwSt)</span>
                <span css={tw`sm:text-2xl text-xl font-semibold`}>
                  EUR { priceFormatter.format(totalPrice / 100) }
                </span>
              </span>
              <div css={tw`mt-4 w-full`}>
                <button
                  css={tw`flex w-full bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg items-center justify-center font-medium text-lg gap-1 transition duration-200 shadow relative overflow-hidden h-9`}
                  onClick={async () => await buyCart()}
                  disabled={loadingSession || cart.length < 1}
                >
                  {(() => {
                    if(loadingSession === true) return (
                      <div css={tw`block h-4 w-4 rounded-full border-2 border-indigo-300 border-t-indigo-100 animate-spin`}></div>
                    )

                    return (
                      <>
                        <HiOutlineCreditCard />
                        <span>Kaufen</span>
                        {
                          cart.length > 0 &&
                          <div css={tw`flex-none w-full top-0 bottom-0 right-full absolute animate-shimmer flex items-center justify-center text-indigo-200`}>
                            <ShimmerSvg />
                          </div>
                        }
                      </>
                    )
                  })()}
                </button>
              </div>
            </div>
            <div css={tw`flex mt-4`}>
              <button css={tw`text-indigo-400 disabled:text-indigo-100 disabled:cursor-not-allowed`} onClick={() => emptyCart()} disabled={cartCount < 1}>Einkaufswagen leeren</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart