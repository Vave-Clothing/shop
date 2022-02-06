import type { NextPage } from 'next'
import tw from 'twin.macro'
import { useSession } from 'next-auth/react'
import { HiOutlineClipboardList, HiOutlineCreditCard, HiOutlineExternalLink, HiOutlineKey, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi'
import Button from '@/components/Button'
import FallbackPage from '@/components/FallbackPage'
import { useRouter } from 'next/router'
import fetcher from '@/lib/fetcher'
import useSWR from 'swr'
import getInitials from '@/lib/getInitials'
import formatPrice from '@/lib/priceFormatter'
import Chip from '@/components/Chip'
import Link from 'next/link'
import MastercardLogo from '@/assets/paymentmethod_logos/mastercard.svg'
import VisaLogo from '@/assets/paymentmethod_logos/visa.svg'
import AmExLogo from '@/assets/paymentmethod_logos/american_express.svg'
import axios from 'axios'
import IconButton from '@/components/IconButton'
import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { cx, css } from '@emotion/css'
import toast from 'react-hot-toast'

interface chipSwitch {
  text: string
  color: "green" | "yellow" | "red" | "blue" | "gray"
}
type chipSwitchFunction = (status: string) => chipSwitch

interface cardBrandsProps {
  brand: string
}

const CardBrands = ({ brand }: cardBrandsProps) => {
  switch (brand) {
    case 'mastercard':
      return(
        <MastercardLogo width="100%" height="100%" />
      )
    case 'visa':
      return(
        <VisaLogo width="100%" height="100%" />
      )
    case 'amex':
      return(
        <AmExLogo width="100%" height="100%" />
      )
    default:
      return (
        <HiOutlineCreditCard size="100%" />
      )
  }
}

const Home: NextPage = () => {
  const { data: session, status } = useSession({
    required: true
  })
  const router = useRouter()
  const { query: { successfullyAddedPM } } = router

  const { data, mutate } = useSWR('/api/auth/user/self?scopes=self orders paymentmethods', fetcher)

  const [cardOptions, setCardOptions] = useState<boolean[]>([])
  const [toastShown, setToastShown] = useState(false)
  const [loadingSession, setLoadingSession] = useState(false)

  const chipColorPStatus: chipSwitchFunction = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Nicht Bezahlt', color: 'yellow' }
      case 'processing':
        return { text: 'In Bearbeitung', color: 'yellow' }
      case 'failed':
        return { text: 'Fehlgeschlagen', color: 'red' }
      case 'paid':
        return { text: 'Bezahlt', color: 'green' }
      case 'refunded':
        return { text: 'Zurückerstattet', color: 'blue' }
      case 'disputed':
        return { text: 'Angefochten', color: 'blue' }
      default:
        return { text: 'N/A', color: 'gray' }
    }
  }

  const chipColorSStatus: chipSwitchFunction = (status) => {
    switch (status) {
      case 'orderRecieved':
        return { text: 'In Bearbeitung', color: 'yellow' }
      case 'handedOver':
        return { text: 'An Service', color: 'yellow' }
      case 'onTheWay':
        return { text: 'Auf dem Weg', color: 'yellow' }
      case 'atCustomers':
        return { text: 'Bei dir', color: 'green' }
      default:
        return { text: 'N/A', color: 'gray' }
    }
  }

  const addPaymentMethod = async () => {
    setLoadingSession(true)
    const session = await axios.post('/api/customer/addMethod').then(res => res.data)
    setLoadingSession(false)
    window.location = session.url
  }

  const switchCardOption = (i: number) => {
    const arr = cardOptions
    arr[i] = !arr[i]
    setCardOptions([...arr])
  }

  const deleteCard = async (id: string) => {
    await axios.delete('/api/customer/deleteMethod', { data: { id: id } })
    toast.success('Karte gelöscht')
    mutate()
  }

  useEffect(() => {
    if(successfullyAddedPM?.toString() === 'true' && !toastShown) {
      toast.success('Karte hinzugefügt', { duration: 4000 })
      setToastShown(true)
    }

    const dataLength = data?.paymentMethods.length || 0
    const currentLength = cardOptions.length
    if(dataLength === currentLength) return
    const newArr: boolean[] = []
    for (let i = 0; i < dataLength; i++) {
      newArr.push(false)
    }
    setCardOptions(newArr)
  }, [data, cardOptions, successfullyAddedPM, toastShown])

  if (status === 'authenticated') return (
    <div css={tw`flex flex-col gap-4 items-center`}>
      <div css={tw`grid w-full md:grid-cols-2 grid-cols-1 max-w-2xl mt-8 border-b border-gray-200 dark:border-gray-700 pb-4`}>
        <div css={tw`flex flex-col items-center gap-2`}>
          <div css={tw`select-none`}>
            <span css={tw`flex w-18 h-18 bg-black dark:bg-gray-100 rounded-full items-center justify-center`}>
              <span css={tw`text-white dark:text-black text-3xl font-semibold`}>{ getInitials(data?.self.name || '') }</span>
            </span>
          </div>
          <div css={tw`flex flex-col items-center`}>
            <span css={tw`text-2xl font-semibold`}>{ data?.self.name }</span>
            <span css={tw`text-lg`}>{ session?.user?.email }</span>
          </div>
        </div>
        <div css={tw`flex flex-col items-center justify-center`}>
          <Button onClick={() => router.push('/u/edit')}>
            <>
              <HiOutlinePencilAlt />
              <span>Bearbeiten</span>
            </>
          </Button>
          <Button onClick={() => router.push('/u/security')}>
            <>
              <HiOutlineKey />
              <span>Account-Sicherheit</span>
            </>
          </Button>
        </div>
      </div>
      <div css={tw`flex flex-col w-full max-w-5xl`}>
        <span css={tw`block text-xl font-semibold leading-tight`}>Deine Bestellungen</span>
        <span css={tw`block mb-4 leading-tight`}>Deine letzten fünf Bestellungen</span>
        <table css={tw`table-fixed text-center`}>
          <thead>
            <tr css={tw`border-b border-gray-200 dark:border-gray-700 md:text-base text-sm`}>
              <th>
                <span css={tw`md:inline hidden`}>Bestellungsnummer</span>
                <span css={tw`md:hidden`}>Bestellung</span>
              </th>
              <th>
                <span css={tw`md:inline hidden`}>Gesamtpreis</span>
                <span css={tw`md:hidden`}>Preis</span>
              </th>
              <th>
                <span css={tw`md:inline hidden`}>Bezahlstatus</span>
                <span css={tw`md:hidden`}>Zahlung</span>
              </th>
              <th>
                <span css={tw`md:inline hidden`}>Lieferstatus</span>
                <span css={tw`md:hidden`}>Lieferung</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              data?.orders.slice(0, 5).map((o:any) => (
                <tr key={o.id} css={tw`border-b border-gray-200 odd-of-type:bg-gray-100 hover:bg-gray-200 select-none dark:(border-gray-700 odd-of-type:bg-gray-800 hover:bg-gray-700)`}>
                  <td css={tw`py-1`}>
                    <Link href={`/order/${o.order_number}`} passHref>
                      <a href={`/order/${o.order_number}`} css={tw`flex items-center justify-center`}>
                        <span css={tw`font-mono text-gray-600 dark:text-gray-300 md:hidden`}>{ o.order_number.substring(0, 3) + '...' }</span>
                        <span css={tw`font-mono text-gray-600 dark:text-gray-300 md:inline hidden`}>{o.order_number}</span>
                        <span css={tw`text-gray-500`}>
                          <HiOutlineExternalLink />
                        </span>
                      </a>
                    </Link>
                  </td>
                  <td css={tw`py-1`}>EUR { formatPrice( o.total_price ) }</td>
                  <td css={tw`py-1`}>
                    <span css={tw`md:inline hidden`}>
                      <Chip text={ chipColorPStatus(o.status).text } color={ chipColorPStatus(o.status).color } dot={true} />
                    </span>
                    <span css={tw`md:hidden`}>
                      <Chip color={ chipColorPStatus(o.status).color } dot={true} />
                    </span>
                  </td>
                  <td css={tw`py-1`}>
                    <span css={tw`md:inline hidden`}>
                      <Chip text={ chipColorSStatus(o.shipping_status).text } color={ chipColorSStatus(o.shipping_status).color } dot={true} />
                    </span>
                    <span css={tw`md:hidden`}>
                      <Chip color={ chipColorSStatus(o.shipping_status).color } dot={true} />
                    </span>
                  </td>
                </tr>
              ))
            }
            {
              data?.orders.length < 1 &&
              <tr>
                <td colSpan={4}>
                  <span css={tw`py-0.5 text-gray-400`}>Du hast noch keine Bestellungen</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <Button onClick={() => router.push('/u/orders')} size='small' adCss={tw`md:w-max`}>
          <>
            <HiOutlineClipboardList />
            <span>Alle Bestellungen anzeigen</span>
          </>
        </Button>
      </div>
      <div css={tw`flex flex-col w-full max-w-5xl`}>
        <span css={tw`block text-xl font-semibold leading-tight`}>Gespeicherte Zahlungsmethoden</span>
        <span css={tw`block mb-4 leading-tight`}>Deine gespeicherten Kreditkarten</span>
        <div css={tw`grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2`}>
          {
            data?.paymentMethods.map((m:any, i:number) => (
              <div key={m.id} css={tw`bg-gray-50 aspect-ratio[4280/2699] w-full border border-gray-200 border-radius[10px] relative overflow-hidden dark:(bg-gray-800 border-gray-700)`}>
                <div css={tw`absolute bottom-0 right-0 left-1/2 top-1/2 flex items-end justify-end p-2`}>
                  <span css={tw`w-1/2 h-1/2 text-gray-500 bg-gray-50 rounded dark:(ring-2 ring-gray-400)`}>
                    <CardBrands brand={m.brand} />
                  </span>
                </div>
                <div css={tw`absolute left-0 bottom-1/2 pl-2`}>
                  <span css={tw`text-base`}>{ m.name }</span>
                </div>
                <div css={tw`absolute left-0 top-1/2 pl-2 flex flex-col gap-1`}>
                  <span css={tw`font-mono whitespace-nowrap text-sm flex gap-1 items-center`}>
                    <span>&middot;&middot;&middot;&middot;</span>
                    {
                      m.brand === 'amex' ? (
                        <span>&middot;&middot;&middot;&middot;&middot;&middot;</span>
                      ) : (
                        <>
                          <span>&middot;&middot;&middot;&middot;</span>
                          <span>&middot;&middot;&middot;&middot;</span>
                        </>
                      )
                    }
                    <span>{ m.brand === "amex" ? '·' : '' }{m.last4}</span>
                  </span>
                  <span css={tw`font-mono whitespace-nowrap text-sm flex gap-1 items-center`}>
                    <span>{m.exp_month}</span>
                    <span>/</span>
                    <span>{m.exp_year.toString().substring(2, 4)}</span>
                  </span>
                </div>
                <div css={tw`absolute top-0 right-0 p-2 flex items-center justify-end`}>
                  <IconButton onClick={() => switchCardOption(i)} icon={<HiOutlinePencilAlt />} />
                </div>
                <Transition
                  as={Fragment}
                  show={cardOptions[i] || false}
                  {...{
                    enter: cx(css(tw`transition-opacity duration-300`)),
                    enterFrom: cx(css(tw`opacity-0`)),
                    enterTo: cx(css(tw`opacity-100`)),
                    leave: cx(css(tw`transition-opacity duration-300`)),
                    leaveFrom: cx(css(tw`opacity-100`)),
                    leaveTo: cx(css(tw`opacity-0`)),
                  }}
                >
                  <div css={tw`absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center`} onClick={() => switchCardOption(i)}>
                    <div css={tw`flex gap-1`}>
                      <IconButton onClick={() => deleteCard(m.id)} icon={<HiOutlineTrash />} adCss={tw`bg-white dark:bg-black`} />
                    </div>
                  </div>
                </Transition>
              </div>
            ))
          }
        </div>
        {
          data?.paymentMethods.length < 1 &&
          <div css={tw`flex items-center justify-center`}>
            <span css={tw`text-gray-400`}>Du hast noch keine Karte gespeichert</span>
          </div>
        }
        <Button onClick={() => addPaymentMethod()} size='small' adCss={tw`md:w-max`} loading={loadingSession}>
          <>
            <HiOutlineCreditCard />
            <span>Zahlmethode hinzufügen</span>
          </>
        </Button>
      </div>
    </div>
  )
  return <FallbackPage />
}

export default Home
