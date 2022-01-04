import tw from 'twin.macro'
import MasterCardLogo from '@/assets/paymentmethod_logos/mastercard.svg'
import VisaLogo from '@/assets/paymentmethod_logos/visa.svg'
import AXPLogo from '@/assets/paymentmethod_logos/american_express.svg'
import SEPALogo from '@/assets/paymentmethod_logos/sepa.svg'
import GPLogo from '@/assets/paymentmethod_logos/giropay.svg'
import PayPalLogo from '@/assets/paymentmethod_logos/paypal.svg'

interface paymentMethodCardsProps {
  alignment?: "left" | "center" | "right"
}

const PaymentMethodCards = ({ alignment }: paymentMethodCardsProps) => {
  return (
    <div css={[
      tw`flex gap-2 flex-wrap`,
      alignment === 'left' ? tw`justify-start` :
      alignment === 'center' ? tw`justify-center` :
      alignment === 'right' ? tw`justify-end` :
      tw`justify-start`
    ]}>
      <div css={tw`border border-gray-200 rounded flex items-center justify-center w-16 h-[2.125rem] relative`}>
        <MasterCardLogo css={tw`h-8`} width="100%" />
      </div>
      <div css={tw`border border-gray-200 rounded flex items-center justify-center w-16 h-[2.125rem] relative`}>
        <VisaLogo css={tw`h-8`} width="100%" />
      </div>
      <div css={tw`border border-gray-200 rounded flex items-center justify-center w-16 h-[2.125rem] relative`}>
        <AXPLogo css={tw`h-8`} width="100%" />
      </div>
      <div css={tw`border border-gray-200 rounded flex items-center justify-center w-16 h-[2.125rem] relative`}>
        <img css={tw`h-[1.34rem]`} width="100%" src="https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg" draggable={false} alt="Klarna Logo" />
        <span css={tw`absolute inset-0`}>
          {/* span for hiding "copy image" options in the browser */}
        </span>
      </div>
      <div css={tw`border border-gray-200 rounded flex items-center justify-center w-16 h-[2.125rem] relative`}>
        <SEPALogo />
      </div>
      <div css={tw`border border-gray-200 rounded flex items-center justify-center w-16 h-[2.125rem] relative`}>
        <GPLogo />
      </div>
      <div css={tw`border border-gray-200 rounded flex items-center justify-center w-16 h-[2.125rem] relative`}>
        <PayPalLogo />
      </div>
    </div>
  )
}

export default PaymentMethodCards