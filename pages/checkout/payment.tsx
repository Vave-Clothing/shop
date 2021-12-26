import type { NextPage } from 'next'
import tw from 'twin.macro'
import CheckoutTitle from '@/components/CheckoutTitle'
import { useRouter } from 'next/router'
import { useShoppingCart } from 'use-shopping-cart'
import formatPrice from '@/lib/priceFormatter'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { useMutation } from 'react-query'
import Button from '@/components/Button'
import { HiOutlineArrowNarrowLeft, HiOutlineCreditCard } from 'react-icons/hi'
import { PayPalButtons, PayPalScriptProvider, FUNDING } from '@paypal/react-paypal-js'

interface OnApproveData {
  billingToken?: string | null
  facilitatorAccessToken: string
  orderID: string
  payerID?: string | null
  paymentID?: string | null
  subscriptionID?: string | null
  authCode?: string | null
}

const Payment: NextPage = () => {
  const router = useRouter()
  const { cartDetails, totalPrice } = useShoppingCart()
  const [loadingSession, setLoadingSession] = useState(false)

  const cart = Object.keys(cartDetails).map((key) => {
    const { id, quantity, image, imageLQIP, name, price, size, value, stock, url } = cartDetails[key]
    return { priceId: id, quantity, image, imageLQIP, name, price, size, value, stock, url }
  })

  const getShippingInfo = () => {
    const storage = localStorage.getItem('shippingPlan')
    if(!storage) return
    const formattedStorage = storage.split(':')
    return {
      id: formattedStorage[1],
      value: storage[0],
      title: formattedStorage[2],
      price: Number(formattedStorage[3])
    }
  }

  const buyCart = async () => {
    setLoadingSession(true)
    const data = await axios.post('/api/checkout_sessions/stripe', { cart: cartDetails, shipping: getShippingInfo()?.id }).then(res => res.data)
    setLoadingSession(false)
    window.location = data.url
  }

  const createMutation = useMutation<{ data: any }, AxiosError, any, Response>(
    (): any => axios.post('/api/checkout_sessions/paypal/create', { cart: cartDetails, shipping: getShippingInfo()?.id }),
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

  return (
    <div css={tw`my-4`}>
      <CheckoutTitle router={router} />
      <h2 css={tw`text-2xl font-semibold mt-6 mb-4`}>Wähle eine Bezahlmethode aus</h2>
      <div css={tw`max-w-screen-lg w-full mx-auto flex flex-col md:flex-row gap-4 md:gap-0`}>
        <div css={tw`w-full md:(border-r border-r-gray-200 pr-3)`}>
          <span css={tw`text-xl font-semibold mb-2`}>Bestellzusammenfassung</span>
          <div>
            {
              cart.map((i:any) => (
                <div css={tw`flex items-center justify-between border-b border-b-gray-200 py-1 px-3`} key={i.priceId}>
                  <div css={tw`flex flex-col justify-center`}>
                    <span>{ i.quantity }x { i.name }</span>
                    <span css={tw`text-xs`}>Größe: { i.size.toUpperCase() }</span>
                  </div>
                  <div>
                    <span css={tw`text-lg`}>EUR { formatPrice( i.value / 100 ) }</span>
                  </div>
                </div>
              ))
            }
          </div>
          <div css={tw`flex items-center justify-center`}>
            <Button onClick={() => router.push('/checkout/shipping')} size='small'>
              <>
                <HiOutlineArrowNarrowLeft />
                <span>Zurück</span>
              </>
            </Button>
          </div>
        </div>
        <div css={tw`w-full md:pl-3`}>
          <span css={tw`text-xl font-semibold mb-2`}>Bezahlmethoden</span>
          <div css={tw`flex items-end justify-center flex-col`}>
            <span>
              <span css={tw`mr-4`}>Zwischensumme</span>
              <span css={tw`sm:text-xl text-lg font-medium`}>
                EUR { formatPrice(totalPrice / 100) }
              </span>
            </span>
            <span>
              <span css={tw`mr-4`}>Lieferung: <span css={tw`font-light`}>{ getShippingInfo()?.title }</span></span>
              <span css={tw`sm:text-xl text-lg font-medium`}>
                EUR { formatPrice( getShippingInfo()?.price! / 100 ) }
              </span>
            </span>
            <span>
              <span css={tw`mr-4 sm:text-lg`}>Gesamt</span>
              <span css={tw`sm:text-2xl text-xl font-semibold`}>
                EUR { formatPrice( (totalPrice + getShippingInfo()?.price!) / 100 ) }
              </span>
            </span>
          </div>
          <div css={tw`mt-4 w-full`}>
            <Button onClick={async () => await buyCart()} disabled={cart.length < 1} loading={loadingSession} adCss={tw`w-full`} type='primary' shimmering={true}>
              <>
                <HiOutlineCreditCard />
                <span>Karte</span>
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
          <span css={tw`text-gray-400 text-right block`}>* alle Preise inklusive MwSt</span>
        </div>
      </div>
    </div>
  )
}

export default Payment