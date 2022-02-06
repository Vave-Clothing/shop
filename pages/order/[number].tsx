import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next"
import { HiOutlineCheck, HiOutlineClipboardList, HiOutlineCube, HiOutlineEye, HiOutlineReceiptTax, HiOutlineTruck, HiOutlineUser } from "react-icons/hi"
import tw from 'twin.macro'
import axios from "axios"
import { formatPrice } from "@/lib/priceFormatter"
import Stripe from "stripe"
import FormFieldWrapper from "@/components/FormFieldWrapper"
import FormField from "@/components/FormField"
import FormFieldButton from "@/components/FormFieldButton"
import React, { Dispatch, SetStateAction, useState } from "react"
import Joi from "joi"
import { useRouter } from "next/router"
import Button from "@/components/Button"
import { getSession } from "next-auth/react"
import dbConnect from "@/lib/dbConnect"
import User from "@/schemas/User"
import crypto from "crypto"

interface currentStatusBarProps {
  status: number
}

interface showDetailsFormProps {
  onSubmit(): any
  setZipCode: Dispatch<SetStateAction<string>>
}

const CurrentStatusBar = ({ status }: currentStatusBarProps) => {
  return (
    <div css={tw`w-full flex items-center justify-center`}>
      <div css={tw`grid w-full`}>
        <div css={tw`grid-area[1/1/2/2] flex items-center`}>
          <span css={tw`block w-full border-b border-b-transparent`}></span>
          <span css={[ tw`block w-full border-b transition duration-200`, status > 1 ? tw`border-b-green-400 dark:border-b-green-500` : tw`border-b-gray-200 dark:border-b-gray-700` ]}></span>
        </div>
        <div css={tw`grid-area[1/1/2/2] flex flex-col items-center`}>
          <span css={tw`invisible text-sm md:text-base text-center`}>Auftrag erhalten</span>
          <span css={[
            tw`flex w-10 h-10 md:(w-12 h-12) rounded-full items-center justify-center transform transition duration-200 group-hover:scale-110 bg-gray-400`,
            status > 0 ? tw`bg-green-500` : tw`bg-gray-400 dark:bg-gray-500`
          ]}>
            <span css={tw`text-lg md:text-xl text-white`}>
              {
                status > 1 ? (
                  <HiOutlineCheck />
                ) : (
                  <HiOutlineClipboardList />
                )
              }
            </span>
          </span>
          <span css={tw`text-sm md:text-base text-center`}>Auftrag erhalten</span>
        </div>
      </div>
      <div css={tw`grid w-full`}>
        <div css={tw`grid-area[1/1/2/2] flex items-center`}>
          <span css={[ tw`block w-full border-b transition duration-200`, status > 1 ? tw`border-b-green-400 dark:border-b-green-500` : tw`border-b-gray-200 dark:border-b-gray-700` ]}></span>
          <span css={[ tw`block w-full border-b transition duration-200`, status > 2 ? tw`border-b-green-400 dark:border-b-green-500` : tw`border-b-gray-200 dark:border-b-gray-700` ]}></span>
        </div>
        <div css={tw`grid-area[1/1/2/2] flex flex-col items-center`}>
          <span css={tw`invisible text-sm md:text-base text-center`}>Paket an Versand übergeben</span>
          <span css={[
            tw`flex w-10 h-10 md:(w-12 h-12) rounded-full items-center justify-center transform transition duration-200 group-hover:scale-110`,
            status > 1 ? tw`bg-green-500` : tw`bg-gray-400 dark:bg-gray-500`
          ]}>
            <span css={tw`text-lg md:text-xl text-white`}>
              {
                status > 2 ? (
                  <HiOutlineCheck />
                  ) : (
                  <HiOutlineCube />
                )
              }
            </span>
          </span>
          <span css={tw`text-sm md:text-base text-center`}>Paket an Versand übergeben</span>
        </div>
      </div>
      <div css={tw`grid w-full`}>
        <div css={tw`grid-area[1/1/2/2] flex items-center`}>
          <span css={[ tw`block w-full border-b transition duration-200`, status > 2 ? tw`border-b-green-400 dark:border-b-green-500` : tw`border-b-gray-200 dark:border-b-gray-700` ]}></span>
          <span css={[ tw`block w-full border-b transition duration-200`, status > 3 ? tw`border-b-green-400 dark:border-b-green-500` : tw`border-b-gray-200 dark:border-b-gray-700` ]}></span>
        </div>
        <div css={tw`grid-area[1/1/2/2] flex flex-col items-center`}>
          <span css={tw`invisible text-sm md:text-base text-center`}>Auf dem Weg zu dir</span>
          <span css={[
            tw`flex w-10 h-10 md:(w-12 h-12) rounded-full items-center justify-center transform transition duration-200 group-hover:scale-110`,
            status > 2 ? tw`bg-green-500` : tw`bg-gray-400 dark:bg-gray-500`
          ]}>
            <span css={tw`text-lg md:text-xl text-white`}>
              {
                status > 3 ? (
                  <HiOutlineCheck />
                  ) : (
                  <HiOutlineTruck />
                )
              }
            </span>
          </span>
          <span css={tw`text-sm md:text-base text-center`}>Auf dem Weg zu dir</span>
        </div>
      </div>
      <div css={tw`grid w-full`}>
        <div css={tw`grid-area[1/1/2/2] flex items-center`}>
          <span css={[ tw`block w-full border-b transition duration-200`, status > 3 ? tw`border-b-green-400 dark:border-b-green-500` : tw`border-b-gray-200 dark:border-b-gray-700` ]}></span>
          <span css={tw`block w-full border-b border-b-transparent`}></span>
        </div>
        <div css={tw`grid-area[1/1/2/2] flex flex-col items-center`}>
          <span css={tw`invisible text-sm md:text-base text-center`}>Bei dir</span>
          <span css={[
            tw`flex w-10 h-10 md:(w-12 h-12) rounded-full items-center justify-center transform transition duration-200 group-hover:scale-110`,
            status > 3 ? tw`bg-green-500` : tw`bg-gray-400 dark:bg-gray-500`
          ]}>
            <span css={tw`text-lg md:text-xl text-white`}>
              {
                status > 4 ? (
                  <HiOutlineCheck />
                  ) : (
                  <HiOutlineUser />
                )
              }
            </span>
          </span>
          <span css={tw`text-sm md:text-base text-center`}>Bei dir</span>
        </div>
      </div>
    </div>
  )
}

const ShowDetailsForm = ({ onSubmit, setZipCode }: showDetailsFormProps) => {
  const [postalCode, setPostalCode] = useState('')
  const [error, setError] = useState('')

  const schema = Joi.number().integer().positive().label('PLZ').required().messages({
    'any.required': `"PLZ" ist erforderlich`,
    'number.base': `"PLZ" muss eine Zahl sein`,
    'number.integer': `"PLZ" kann keine Dezimalzahl sein`,
    'number.positive': `"PLZ" kann keine negative Zahl sein`
  })

  const onChangePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const result = schema.validate(value)
    setError(result.error?.details[0].message || '')
    if(!value) setError(`"PLZ" ist erforderlich`)
    setPostalCode(value)
    setZipCode(value)
  }

  const submit = () => {
    const value = postalCode
    const result = schema.validate(value)
    if(result.error) {
      setError(result.error?.details[0].message || '')
      if(!value) setError(`"PLZ" ist erforderlich`)
    } else {
      onSubmit()
    }
  }

  return (
    <FormFieldWrapper error={error}>
      <>
        <FormField
          prependIcon={<HiOutlineTruck />}
          placeholder="PLZ"
          value={postalCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePostalCode(e)}
          error={error ? true : false}
          onEnter={() => submit()}
        />
        <FormFieldButton onClick={() => submit()}>
          <>
            <HiOutlineEye />
            <span>Anzeigen</span>
          </>
        </FormFieldButton>
      </>
    </FormFieldWrapper>
  )
}

const Order: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const cart = data.purchased_items
  const [postalCode, setPostalCode] = useState('')
  const router = useRouter()

  const paymentStatus = () => {
    switch (data.status) {
      case 'pending':
        return { color: 'gray', message: 'Nicht Bezahlt' }
      case 'processing':
        return { color: 'yellow', message: 'In Bearbeitung' }
      case 'failed':
        return { color: 'red', message: 'Fehlgeschlagen' }
      case 'paid':
        return { color: 'green', message: 'Bezahlt' }
      case 'refunded':
        return { color: 'blue', message: 'Zurückerstattet' }
      case 'disputed':
        return { color: 'blue', message: 'Angefochten' }
    }
  }

  const shippingStatus = () => {
    switch (data.shipping_status) {
      case 'orderRecieved':
        return 1
      case 'handedOver':
        return 2
      case 'onTheWay':
        return 3
      case 'atCustomers':
        return 4
      default:
        return 0
    }
  }

  const viewFullData = async () => {
    router.push(`/order/${data.order_number}?postalCode=${postalCode}`)
  }

  return (
    <div>
      <h1 css={tw`text-4xl font-semibold mb-4 flex flex-col justify-center leading-none`}><span>Deine Bestellung</span><span css={tw`font-mono text-base leading-none text-gray-600 dark:text-gray-300`}>{data.order_number}</span></h1>
      <CurrentStatusBar status={shippingStatus()} />
      <div css={tw`max-w-screen-lg w-full mx-auto flex flex-col md:flex-row gap-4 md:gap-0 mt-8`}>
        <div css={tw`w-full md:(border-r border-r-gray-200 dark:border-r-gray-700 pr-3)`}>
          <span css={tw`text-xl font-semibold mb-2 hidden md:block`}>Bestellte Produkte</span>
          <div>
            {
              cart.map((i:any) => (
                <div css={tw`flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 py-1 px-3`} key={i.priceId}>
                  <div css={tw`flex flex-col justify-center`}>
                    <span>{ i.quantity }x { i.name }</span>
                  </div>
                  <div>
                    <span css={tw`text-lg`}>EUR { formatPrice( i.price * i.quantity ) }</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div css={tw`w-full md:pl-3`}>
          <span css={tw`text-xl font-semibold mb-2 hidden  md:block`}>Betrag</span>
          <div css={tw`flex items-end justify-center flex-col`}>
            <span>
              <span css={tw`mr-4`}>Zwischensumme</span>
              <span css={tw`sm:text-xl text-lg font-medium`}>
                EUR { formatPrice(data.total_price - data.shipping_rate.price) }
              </span>
            </span>
            <span>
              <span css={tw`mr-4`}>Lieferung: <span css={tw`font-light`}>{data.shipping_rate.name}</span></span>
              <span css={tw`sm:text-xl text-lg font-medium`}>
                EUR { formatPrice(data.shipping_rate.price) }
              </span>
            </span>
            <span>
              <span css={tw`mr-4 sm:text-lg`}>Gesamt</span>
              <span css={tw`sm:text-2xl text-xl font-semibold`}>
                EUR { formatPrice(data.total_price) }
              </span>
            </span>
          </div>
          <span css={tw`text-gray-400 text-right block`}>* alle Preise inklusive MwSt</span>
          <div css={tw`mt-2 flex flex-col`}>
            <span css={tw`text-lg font-medium`}>Bezahlstatus</span>
            <div css={tw`flex gap-2 items-center`}>
              <span css={[
                tw`block w-2 h-2 rounded-full shadow`,
                paymentStatus()?.color === 'gray' ? tw`bg-gray-400 dark:bg-gray-500` :
                paymentStatus()?.color === 'yellow' ? tw`bg-yellow-400 dark:bg-yellow-500` :
                paymentStatus()?.color === 'green' ? tw`bg-green-500 dark:bg-green-400` :
                paymentStatus()?.color === 'red' ? tw`bg-red-500 dark:bg-red-400` :
                paymentStatus()?.color === 'blue' ? tw`bg-blue-400 dark:bg-blue-500` :
                tw`bg-gray-400 dark:bg-gray-500`
              ]}></span>
              <span>{ paymentStatus()?.message }</span>
              {
                paymentStatus()?.color === 'red' &&
                <span css={tw`italic font-light`}>Informationen an { data.email.replace(/\*/g, '·') } gesendet</span>
              }
            </div>
            {
              !data.shipping_address ? (
                <div css={tw`mt-2`}>
                  <span>Weitere Details anzeigen</span>
                  <ShowDetailsForm onSubmit={() => viewFullData()} setZipCode={setPostalCode} />
                </div>
              ) : (
                <div css={tw`mt-2 flex flex-col`}>
                  <span css={tw`text-lg font-medium`}>Details</span>
                  <span css={tw`font-medium mt-1`}>Emails an</span>
                  <span>{data.email.replace(/\*/g, '·')}</span>
                  <span css={tw`font-medium mt-1`}>Lieferung an</span>
                  <div css={tw`flex flex-col border border-gray-200 dark:border-gray-700 px-2 py-1 rounded shadow-sm leading-snug`}>
                    <span>{data.shipping_address.name}</span>
                    <span>{data.shipping_address.line1}</span>
                    <span>{data.shipping_address.line2}</span>
                    {
                      data.shipping_address.state ? (
                        <>
                          <span>{data.shipping_address.state + '-' + data.shipping_address.zip + ' ' + data.shipping_address.city}</span>
                          <span>{data.shipping_address.country}</span>
                        </>
                      ) : (
                        <span>{data.shipping_address.country + '-' + data.shipping_address.zip + ' ' + data.shipping_address.city}</span>
                      )
                    }
                  </div>
                  {
                    data.stripeReceipt &&
                    <Button onClick={() => open(data.stripeReceipt)} size="small">
                      <>
                        <HiOutlineReceiptTax />
                        <span>Rechnung anzeigen</span>
                      </>
                    </Button>
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const stripe = new Stripe(process.env.STRIPE_SK!, {
    apiVersion: '2020-08-27',
  })

  const postalCode = ctx.query['postalCode']

  const session = await getSession(ctx)
  const email = session?.user?.email
  let userID = ''
  if(session) {
    await dbConnect()
    const user = await User.findOne({ email: email })
    userID = user._id.toString()
  }

  let data
  try {
    const accessHash = (crypto.createHash('sha256').update(`${userID}:${process.env.STRIPE_SK}`).digest('hex')).substring(0, 16)
    data = await axios.get(`http://localhost:3000/api/order/get?orderNumber=${ctx.params?.number}`, { params: { postalCode: postalCode, accessHash: accessHash } }).then(res => res.data)
    if(data.user_id) {
      if(userID !== data.user_id) return { notFound: true }
    }
  } catch(err: any) {
    if(err.response.status === 404) return { notFound: true }
  }

  const cartItems = await Promise.all(data.purchased_items.map(async (i:any) => {
    const { id, quantity, price } = i
    const resPrice = await stripe.prices.retrieve(id, { expand: [ 'product' ] })
    // @ts-ignore
    return { id, quantity, price, name: resPrice.product?.name }
  }))

  const shippingRate = await stripe.shippingRates.retrieve(data.shipping_rate.id)

  return {
    props: {
      data: {
        ...data,
        purchased_items: cartItems,
        shipping_rate: {
          id: data.shipping_rate.id,
          price: data.shipping_rate.price,
          name: shippingRate.display_name,
        },
      },
    }
  }
}