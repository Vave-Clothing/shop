import type { NextPage } from 'next'
import { HiOutlineMinus, HiOutlinePlus, HiOutlineX } from 'react-icons/hi'
import tw from 'twin.macro'
import { useShoppingCart } from 'use-shopping-cart'

const Cart: NextPage = () => {
  const { cartDetails, clearCart } = useShoppingCart()

  return (
    <div>
      <h1 css={tw`text-4xl font-semibold mt-3 mb-2`}>
        Einkaufswagen
      </h1>
      <div>
        <div css={tw`border-b border-gray-200 py-3 px-4 flex justify-between items-center`}>
          <div css={tw`flex flex-col`}>
            <span css={tw`text-xl font-medium leading-tight`}>Name</span>
            <span css={tw`leading-tight`}>Size</span>
          </div>
          <div css={tw`flex items-center gap-4`}>
            <div css={tw`flex`}>
              <button css={tw`w-8 h-8 hover:bg-red-200 hover:text-red-500 rounded flex items-center justify-center`}>
                <HiOutlineMinus />
              </button>
              <span css={tw`w-8 h-8 flex items-center justify-center`}>0</span>
              <button css={tw`w-8 h-8 hover:bg-green-200 hover:text-green-500 rounded flex items-center justify-center`}>
                <HiOutlinePlus />
              </button>
            </div>
            <div css={tw`flex items-center justify-center`}>
              <span>x 10,00 EUR</span>
              <button css={tw`w-8 h-8 hover:text-red-500 rounded flex items-center justify-center`}>
                <HiOutlineX />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart