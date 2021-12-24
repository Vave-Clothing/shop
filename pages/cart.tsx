import type { NextPage } from 'next'
import { HiOutlineArrowNarrowRight, HiOutlineCreditCard, HiOutlineMinus, HiOutlinePlus, HiOutlineX } from 'react-icons/hi'
import tw from 'twin.macro'
import { useShoppingCart } from 'use-shopping-cart'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useRef, useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import Button from '@/components/Button'
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'

interface OnApproveData {
  billingToken?: string | null
  facilitatorAccessToken: string
  orderID: string
  payerID?: string | null
  paymentID?: string | null
  subscriptionID?: string | null
  authCode?: string | null
}

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const Cart: NextPage = () => {
  const router = useRouter()

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

  const createMutation = useMutation<{ data: any }, AxiosError, any, Response>(
    (): any => axios.post('/api/checkout_sessions/paypal/create', { cart: cartDetails }),
  )

  const captureMutation = useMutation<string, AxiosError, any, Response>(
    (data): any => axios.put('/api/checkout_sessions/paypal/capture', data),
  )

  const createPayPalOrder = async (): Promise<string> => {
    setLoadingSession(true)
    const response = await createMutation.mutateAsync({})
    return response.data.orderID
  }

  const onApprove = async (data: OnApproveData): Promise<void> => {
    setLoadingSession(false)
    await captureMutation.mutateAsync({ orderID: data.orderID })
    router.push('/success?pid=' + data.orderID + '&platform=paypal')
    return
  }

  const onCancel = () => {
    setLoadingSession(false)
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
                <div css={tw`flex items-center gap-4 sm:justify-start justify-between`}>
                  <div css={tw`flex`}>
                    <button
                      css={tw`w-8 h-8 hover:(bg-red-200 text-red-500) rounded flex items-center justify-center transition duration-200 disabled:(cursor-not-allowed text-gray-400 hover:(text-red-400 bg-red-50))`}
                      disabled={ i.quantity < 2 }
                      onClick={() => decrementItem(i.priceId)}
                    >
                      <HiOutlineMinus />
                    </button>
                    <span css={tw`w-8 h-8 flex items-center justify-center`}>{ i.quantity }</span>
                    <button
                      css={tw`w-8 h-8 hover:(bg-green-200 text-green-500) rounded flex items-center justify-center transition duration-200 disabled:(cursor-not-allowed text-gray-400 hover:(text-green-400 bg-green-50))`}
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
              <span css={tw`text-primary-500 hover:text-primary-400 transition duration-200`}>
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
        <div css={tw`lg:(border-l pl-3) border-gray-200`}>
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
                <Button onClick={async () => await buyCart()} disabled={cart.length < 1} loading={loadingSession} adCss={tw`w-full`} type='primary' shimmering={true}>
                  <>
                    <HiOutlineCreditCard />
                    <span>Kaufen</span>
                  </>
                </Button>
              </div>
              <PayPalScriptProvider
                options={{
                  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CID,
                  currency: 'EUR'
                }}
              >
                <div css={tw`w-full mt-2`}>
                  <PayPalButtons
                    style={{
                      color: 'black',
                      shape: 'rect',
                      label: 'pay',
                      height: 36,
                      layout: 'vertical'
                    }}
                    fundingSource={FUNDING.PAYPAL}
                    createOrder={createPayPalOrder}
                    onApprove={onApprove}
                    onCancel={onCancel}
                    disabled={cart.length < 1 || loadingSession}
                  />
                </div>
              </PayPalScriptProvider>
            </div>
            <div css={tw`flex mt-4`}>
              <button css={tw`text-primary-400 disabled:(text-primary-100 cursor-not-allowed)`} onClick={() => emptyCart()} disabled={cartCount < 1}>Einkaufswagen leeren</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart