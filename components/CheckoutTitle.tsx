import Link from 'next/link'
import { NextRouter } from 'next/router'
import { HiOutlineCheck, HiOutlineCreditCard, HiOutlineCube, HiOutlineShoppingCart } from 'react-icons/hi'
import tw from 'twin.macro'
import HeadLogo from '@/assets/vave-logo-head-fit.svg'

interface checkoutTitleProps {
  router: NextRouter
}

const CheckoutTitle = ({ router }: checkoutTitleProps) => {
  const currentStep = () => {
    switch (router.pathname) {
      case '/checkout/begin':
        return 1
      case '/checkout/shipping':
        return 2
      case '/checkout/payment':
        return 3
      default:
        return 0
    }
  }

  return (
    <div>
      <h1 css={tw`text-4xl font-semibold mb-4 flex items-center gap-3`}>
        <HeadLogo />
        <span css={tw`block border-l border-l-gray-200 dark:border-l-gray-700 h-7 ml-0.5`}></span>
        <span>Checkout</span>
      </h1>
      <div css={tw`flex justify-around`}>
        <div>
          <Link href="/checkout/begin" passHref>
            <a href="/checkout/begin" className='group' css={tw`flex flex-col items-center justify-center`}>
              <span css={[
                tw`flex w-10 h-10 md:(w-12 h-12) rounded-full items-center justify-center transform transition duration-200 group-hover:scale-110`,
                currentStep() > 0 ? tw`bg-green-500` : tw`bg-gray-400 dark:bg-gray-500`
              ]}>
                <span css={tw`text-lg md:text-xl text-white`}>
                  {
                    currentStep() > 1 ? (
                      <HiOutlineCheck />
                    ) : (
                      <HiOutlineShoppingCart />
                    )
                  }
                </span>
              </span>
              <span css={tw`text-sm md:text-base`}>Bestellübersicht</span>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/checkout/shipping" passHref>
            <a href="/checkout/shipping" className='group' css={tw`flex flex-col items-center justify-center`}>
              <span css={[
                tw`flex w-10 h-10 md:(w-12 h-12) rounded-full items-center justify-center transform transition duration-200 group-hover:scale-110`,
                currentStep() > 1 ? tw`bg-green-500` : tw`bg-gray-400 dark:bg-gray-500`
              ]}>
                <span css={tw`text-lg md:text-xl text-white`}>
                  {
                    currentStep() > 2 ? (
                      <HiOutlineCheck />
                    ) : (
                      <HiOutlineCube />
                    )
                  }
                </span>
              </span>
              <span css={tw`text-sm md:text-base`}>Lieferung</span>
            </a>
          </Link>
        </div>
        <div>
          <Link href="/checkout/payment" passHref>
            <a
              href="/checkout/payment"
              className='group'
              css={[tw`flex flex-col items-center justify-center`, currentStep() > 2 ? tw`pointer-events-auto` : tw`pointer-events-none`]}
              tabIndex={currentStep() > 2 ? 0 : -1}
            >
              <span css={[
                tw`flex w-10 h-10 md:(w-12 h-12) rounded-full items-center justify-center transform transition duration-200 group-hover:scale-110`,
                currentStep() > 2 ? tw`bg-green-500` : tw`bg-gray-400 dark:bg-gray-500`
              ]}>
                <span css={tw`text-lg md:text-xl text-white`}>
                  {
                    currentStep() > 3 ? (
                      <HiOutlineCheck />
                    ) : (
                      <HiOutlineCreditCard />
                    )
                  }
                </span>
              </span>
              <span css={tw`text-sm md:text-base`}>Bezahlvorgang</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutTitle