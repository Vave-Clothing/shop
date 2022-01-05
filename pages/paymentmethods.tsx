import type { NextPage } from 'next'
import tw from 'twin.macro'
import PaymentMethodCards from '@/components/PaymentMethodCards'
import { useRouter } from 'next/router'
import Button from '@/components/Button'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'

const PaymentMethods: NextPage = () => {
  const router = useRouter()
  const { query: { backTo } } = router

  const getBackLink = () => {
    switch (backTo) {
      case 'checkout':
        return '/checkout/payment'
      default:
        return '/shop'
    }
  }

  return (
    <div>
      {
        backTo &&
        <Button onClick={() => router.push(getBackLink())}>
          <>
            <span>Zurück</span>
            <HiOutlineArrowNarrowRight />
          </>
        </Button>
      }
      <h1 css={tw`text-4xl font-semibold mt-6 mb-1`}>
        Bezahlmethoden
      </h1>
      <p css={tw`mb-4 text-gray-500`}>
        Mit diesen Karten/Services kannst du hier bezahlen
      </p>
      <PaymentMethodCards />
      <div>
        <h3 css={tw`text-2xl font-semibold mt-6 mb-4`}>Details</h3>
        <h4 css={tw`text-xl font-semibold mt-6 mb-3`}>Stripe</h4>
        <p css={tw`mb-3`}>
          Mit Stripe kannst du mit diesen Zahlungsmöglichkeiten bezahlen.<br />
          Du musst einfach beim Checkout auf &quot;Karte&quot; klicken.
        </p>
        <ul css={tw`list-disc ml-8 mb-3`}>
          <li css={tw`pl-1`}>
            Mastercard
          </li>
          <li css={tw`pl-1`}>
            Visa
          </li>
          <li css={tw`pl-1`}>
            American Express
          </li>
          <li css={tw`pl-1`}>
            Klarna
          </li>
          <li css={tw`pl-1`}>
            Klarna SOFORT
          </li>
          <li css={tw`pl-1`}>
            SEPA Lastschrift
          </li>
          <li css={tw`pl-1`}>
            giropay
          </li>
        </ul>
        <h4 css={tw`text-xl font-semibold mt-6 mb-3`}>PayPal</h4>
        <p css={tw`mb-3`}>
          Du kannst deine Bestellung auch mit PayPal abschließen.<br />
          Hier stehen dir folgende Möglichkeiten zur verfügung:
        </p>
        <ul css={tw`list-disc ml-8 mb-3`}>
          <li css={tw`pl-1`}>
            PayPal Guthaben
          </li>
          <li css={tw`pl-1`}>
            Mastercard
          </li>
          <li css={tw`pl-1`}>
            Visa
          </li>
          <li css={tw`pl-1`}>
            American Express
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PaymentMethods