import tw from 'twin.macro'
import { HiOutlineMenuAlt2, HiOutlineShoppingCart, HiOutlineUserCircle } from 'react-icons/hi'
import Link from 'next/link'
import { Dispatch, SetStateAction, useLayoutEffect, useRef } from 'react'
import Logo from '@/assets/vave-logo-head-fit.svg'
import { gsap } from 'gsap'

interface navBarProps {
  openMenu: Dispatch<SetStateAction<boolean>>
}

const NavBar = ({ openMenu }: navBarProps) => {
  const svg = useRef(null)
  const q = gsap.utils.selector(svg)

  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { opacity: 0 } })
    tl.fromTo(q("#background"), { opacity: 0 }, { opacity: 1, delay: .5 })
    tl.fromTo(q("#foreground"), { opacity: 0, scale: 1.25, transformOrigin: "center" }, { opacity: 1, scale: 1 })
  }, [q])

  return (
    <div css={tw`w-full flex justify-center items-center bg-gray-100 border-b border-gray-200 sticky top-0 z-40`}>
      <div css={tw`max-w-[96rem] w-full text-black`}>
        <div css={tw`flex justify-between text-2xl items-center px-6 py-3`}>
          <div>
            <span>
              <Link href="/" passHref>
                <a href="/" ref={svg}>
                  <Logo id="logo_head" />
                </a>
              </Link>
            </span>
          </div>
          <div css={tw`flex gap-4 items-center`}>
            <span>
              <Link href="/login">
                <a>
                  <HiOutlineUserCircle />
                  <span css={tw`sr-only`}>Login</span>
                </a>
              </Link>
            </span>
            <span>
              <Link href="/cart">
                <a>
                  <HiOutlineShoppingCart />
                  <span css={tw`sr-only`}>Einkaufswagen</span>
                </a>
              </Link>
            </span>
            <span css={tw`flex items-center`}>
              <button onClick={() => openMenu(true)}>
                <HiOutlineMenuAlt2 />
                <span css={tw`sr-only`}>Menü öffnen</span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar