import FallbackPage from '@/components/FallbackPage'
import UserHeader from '@/components/UserHeader'
import type { NextPage } from 'next'
import tw from 'twin.macro'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import fetcher from '@/lib/fetcher'
import Link from 'next/link'
import { HiOutlineExternalLink } from 'react-icons/hi'
import formatPrice from '@/lib/priceFormatter'
import Chip from '@/components/Chip'

interface chipSwitch {
  text: string
  color: "green" | "yellow" | "red" | "blue" | "gray"
}
type chipSwitchFunction = (status: string) => chipSwitch

const Orders: NextPage = () => {
  const { status } = useSession({ required: true })

  const { data } = useSWR('/api/auth/user/self?scopes=self orders', fetcher)

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

  if(status === 'authenticated') return (
    <div css={tw`flex flex-col gap-4 items-center`}>
      <UserHeader name={data?.self.name} email={data?.self.email} />
      <div css={tw`w-full max-w-5xl`}>
        <h1 css={tw`text-xl font-semibold leading-tight`}>Bestellungen</h1>
        <span css={tw`block mb-4 leading-tight font-light text-sm`}>Hier sind alle deine Bestellungen</span>
        <table css={tw`table-fixed text-center w-full`}>
          <thead>
            <tr css={tw`border-b border-gray-200 md:text-base text-sm`}>
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
              data?.orders.map((o:any) => (
                <tr key={o.id} css={tw`border-b border-gray-200 odd-of-type:bg-gray-100 hover:bg-gray-200 select-none`}>
                  <td css={tw`py-1`}>
                    <Link href={`/order/${o.order_number}`} passHref>
                      <a href={`/order/${o.order_number}`} css={tw`flex items-center justify-center`}>
                        <span css={tw`font-mono text-gray-600 md:hidden`}>{ o.order_number.substring(0, 3) + '...' }</span>
                        <span css={tw`font-mono text-gray-600 md:inline hidden`}>{o.order_number}</span>
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
      </div>
    </div>
  )

  return <FallbackPage />
}

export default Orders