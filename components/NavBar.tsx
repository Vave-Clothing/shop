import tw from 'twin.macro'
import { HiOutlineMenuAlt2, HiOutlineShoppingCart, HiOutlineUserCircle } from 'react-icons/hi'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'

interface navBarProps {
  openMenu: Dispatch<SetStateAction<boolean>>
}

const NavBar = ({ openMenu }: navBarProps) => {
  return (
    <div css={tw`w-full flex justify-center items-center bg-gray-100 border-b border-gray-200`}>
      <div css={tw`max-w-[96rem] w-full text-black`}>
        <div css={tw`flex justify-between text-2xl items-center px-6 py-3`}>
          <div>
            <span>
              <Link href="/">
                LOGO
              </Link>
            </span>
          </div>
          <div css={tw`flex gap-4 items-center`}>
            <span>
              <Link href="/login">
                <a>
                  <HiOutlineUserCircle />
                </a>
              </Link>
            </span>
            <span>
              <Link href="/cart">
                <a>
                  <HiOutlineShoppingCart />
                </a>
              </Link>
            </span>
            <span css={tw`flex items-center`}>
              <button onClick={() => openMenu(true)}>
                <HiOutlineMenuAlt2 />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar