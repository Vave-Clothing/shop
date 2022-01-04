import CheckoutTitle from "@/components/CheckoutTitle"
import type { NextPage, GetStaticProps, InferGetStaticPropsType } from "next"
import tw from 'twin.macro'
import { useRouter } from "next/router"
import { RadioGroup } from "@headlessui/react"
import { useState, useEffect, useCallback } from "react"
import { HiOutlineCheck, HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from "react-icons/hi"
import Stripe from 'stripe'
import formatPrice from "@/lib/priceFormatter"
import { useShoppingCart } from 'use-shopping-cart'
import Button from '@/components/Button'
import Alert from '@/components/Alert'

interface shippingPlan {
  title: string
  description: string
  service: string
  value: string
  id: string
  when: string
  price?: number
}

const shippingPlans = [
  { title: 'Standard', description: 'Normaler Versand', service: 'DHL', value: 'standard', id: 'shr_1K4UBVKaS5tycN9yIEkgstIT', when: '1-5' },
  { title: 'Express', description: 'Expressversand', service: 'DHL', value: 'express', id: 'shr_1KB20EKaS5tycN9y7CBAjNtt', when: '1-3' }
]

const Shipping: NextPage = ({ shippingPlansStripe }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const [shippingPlan, setShippingPlan] = useState(shippingPlansStripe[0].value)
  const { totalPrice } = useShoppingCart()

  const currentShippingPrice = () => {
    const plan = shippingPlansStripe.find((p: shippingPlan) => p.value === shippingPlan)
    return plan.price
  }

  const getShippingPlan = useCallback((v:string) => {
    const plan = shippingPlansStripe.find((p:shippingPlan) => p.value === v)
    return plan
  }, [shippingPlansStripe])

  const selectPlan = (v:string) => {
    setShippingPlan(v)
    localStorage.setItem('shippingPlan', `${v}:${getShippingPlan(v).id}:${getShippingPlan(v).title}:${getShippingPlan(v).price}`)
  }

  const setStorageDefault = useCallback(() => {
    localStorage.setItem('shippingPlan', `${shippingPlan}:${getShippingPlan(shippingPlan).id}:${getShippingPlan(shippingPlan).title}:${getShippingPlan(shippingPlan).price}`)
  }, [shippingPlan, getShippingPlan])

  useEffect(() => {
    const storage = localStorage.getItem('shippingPlan')
    if(!storage) return setStorageDefault()

    const valueInStorage = storage.split(':')[0]

    const findPlan = shippingPlansStripe.find((p:shippingPlan) => p.value === valueInStorage)
    if(!findPlan) return setStorageDefault()

    setShippingPlan(valueInStorage)
  }, [shippingPlansStripe, setStorageDefault])

  return (
    <div css={tw`my-4`}>
      <CheckoutTitle router={router} />
      <h2 css={tw`text-2xl font-semibold mt-6 mb-4`}>Wähle eine der unten stehenden Lieferoptionen</h2>
      <div css={tw`max-w-lg mx-auto`}>
        <RadioGroup value={shippingPlan} onChange={selectPlan}>
          {
            shippingPlansStripe.map((p:shippingPlan, i:number) => (
              <RadioGroup.Option value={p.value} key={i} css={tw`focus:outline-none focus-visible:ring-3 ring-gray-400 rounded-lg transition duration-200`} className="group">
                {({ checked }) => (
                  <div css={[
                    tw`flex justify-between items-center py-2 px-5 rounded-lg my-2 shadow cursor-pointer transition duration-200`,
                    checked ? tw`bg-gray-500 text-white` : tw`bg-gray-200 group-hover:bg-gray-300`
                  ]}>
                    <div>
                      <RadioGroup.Label
                        as="p"
                        css={tw`text-lg font-medium`}
                      >
                        { p.title }
                        {' '}&middot;{' '}
                        EUR { formatPrice( p.price! / 100 ) }
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="p"
                        css={tw`text-sm`}
                      >
                        { p.description }
                        {' '}&middot;{' '}
                        { p.service }
                        <br />
                        { 'Lieferung in ' +  p.when + ' Werktagen' }
                      </RadioGroup.Description>
                    </div>
                    <div css={[
                      tw`text-xl rounded-full p-1 bg-white bg-opacity-25 text-white transition duration-200 shadow-sm`,
                      checked ? tw`opacity-100` : tw`opacity-0`
                    ]}>
                      <HiOutlineCheck />
                    </div>
                  </div>
                )}
              </RadioGroup.Option>
            ))
          }
        </RadioGroup>
        <div css={tw`my-4`}>
          <div css={tw`flex items-end justify-center mt-3 flex-col lg:min-width[22rem]`}>
            <span>
              <span css={tw`mr-4`}>Zwischensumme</span>
              <span css={tw`sm:text-xl text-lg font-medium`}>
                EUR { formatPrice(totalPrice / 100) }
              </span>
            </span>
            <span>
              <span css={tw`mr-4`}>Lieferung</span>
              <span css={tw`sm:text-xl text-lg font-medium`}>
                EUR { formatPrice( currentShippingPrice() / 100 ) }
              </span>
            </span>
            <span>
              <span css={tw`mr-4 sm:text-lg`}>Gesamt</span>
              <span css={tw`sm:text-2xl text-xl font-semibold`}>
                EUR { formatPrice( (totalPrice + currentShippingPrice()) / 100 ) }
              </span>
            </span>
            <div css={tw`mt-2 w-full flex gap-4`}>
              <Button onClick={() => router.push('/checkout/begin')} adCss={tw`w-full`}>
                <>
                  <HiOutlineArrowNarrowLeft />
                  <span>Zurück</span>
                </>
              </Button>
              <Button onClick={() => router.push('/checkout/payment')} adCss={tw`w-full`} type='primary'>
                <>
                  <span>Weiter</span>
                  <HiOutlineArrowNarrowRight />
                </>
              </Button>
            </div>
          </div>
        </div>
        <Alert title="Lieferadresse" description="Deine Lieferadresse wird beim Bezahlen abgefragt" type="info" />
      </div>
    </div>
  )
}

export default Shipping

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SK!, {
    apiVersion: '2020-08-27',
  })

  const newShippingPlans = await Promise.all(shippingPlans.map(async (p:shippingPlan) => {
    const { title, description, service, value, id, when } = p

    const price = await (await stripe.shippingRates.retrieve(id)).fixed_amount?.amount

    return { id, title, description, service, value, price, when }
  }))

  return {
    props: {
      shippingPlansStripe: newShippingPlans
    }
  }
}