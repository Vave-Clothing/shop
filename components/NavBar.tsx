import tw from 'twin.macro'
import { HiOutlineMenuAlt2, HiOutlineShoppingCart } from 'react-icons/hi'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { useRouter } from 'next/router'
import NavBarLogo from '@/components/NavBarLogo'
import LoginHeader from './LoginHeader'

interface navBarProps {
  openMenu: Dispatch<SetStateAction<boolean>>
}

const NavBar = ({ openMenu }: navBarProps) => {
  const router = useRouter()
  const { cartCount } = useShoppingCart()

  return (
    <div css={tw`w-full flex justify-center items-center bg-gray-100 border-b border-gray-200 sticky top-0 z-40 dark:(bg-gray-800 border-gray-700)`} id="navBar">
      <div css={tw`max-w-[96rem] w-full text-black dark:text-gray-100`}>
        <div css={tw`flex justify-between text-2xl items-center px-6 py-3`}>
          <div>
            <span>
              <Link href={router.pathname !== '/shop' ? '/shop' : '/'} passHref>
                <a href={router.pathname !== '/shop' ? '/shop' : '/'}>
                  <NavBarLogo />
                </a>
              </Link>
            </span>
          </div>
          <div css={tw`flex gap-4 items-center justify-center relative`}>
            <LoginHeader />
            <span>
              <Link href="/cart" passHref>
                <a css={tw`grid grid-cols-2 grid-rows-2 w-6 h-6`} href="/cart">
                  <HiOutlineShoppingCart style={{ gridArea: '1 / 1 / 3 / 3' }} />
                  <span css={tw`h-4 min-width[1rem] w-max px-1 bg-black dark:(bg-gray-100 text-black) rounded-full text-white text-xs block font-medium text-center grid-area[2/2/3/3]`}>
                    { cartCount || 0 }
                  </span>
                  <span css={tw`sr-only`}>Einkaufswagen</span>
                </a>
              </Link>
            </span>
            <span css={tw`flex items-center`}>
              <button onClick={() => openMenu(true)}>
                <HiOutlineMenuAlt2 />
                <span css={tw`sr-only`}>Men?? ??ffnen</span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar