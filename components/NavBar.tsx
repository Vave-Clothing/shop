import tw from 'twin.macro'
import { HiOutlineMenuAlt2, HiOutlineShoppingCart, HiOutlineUserCircle } from 'react-icons/hi'
import Link from 'next/link'
import { Dispatch, SetStateAction, useLayoutEffect, useRef, useState, useEffect } from 'react'
import Logo from '@/assets/vave-logo-head-fit.svg'
import { gsap } from 'gsap'
import { useShoppingCart } from 'use-shopping-cart'
import { useRouter } from 'next/router'

interface navBarProps {
  openMenu: Dispatch<SetStateAction<boolean>>
}

const NavBar = ({ openMenu }: navBarProps) => {
  const router = useRouter();
  const [animationPlayed, setAnimationPlayed] = useState(false)
  const svg = useRef(null)
  const q = gsap.utils.selector(svg)
  const { cartCount } = useShoppingCart()

  useLayoutEffect(() => {
    if(animationPlayed === false) {
      const tl = gsap.timeline({ defaults: { opacity: 0 } })
      tl.fromTo(q("#background"), { opacity: 0 }, { opacity: 1, delay: .5 })
      tl.fromTo(q("#foreground"), { opacity: 0, scale: 1.25, transformOrigin: "center" }, { opacity: 1, scale: 1 })
      setAnimationPlayed(true)
    }
  }, [q, animationPlayed])

  return (
    <div css={tw`w-full flex justify-center items-center bg-gray-100 border-b border-gray-200 sticky top-0 z-40`} id="navBar">
      <div css={tw`max-w-[96rem] w-full text-black`}>
        <div css={tw`flex justify-between text-2xl items-center px-6 py-3`}>
          <div>
            <span>
              <Link href={router.pathname !== '/shop' ? '/shop' : '/'} passHref>
                <a href={router.pathname !== '/shop' ? '/shop' : '/'} ref={svg}>
                  <Logo id="logo_head" />
                </a>
              </Link>
            </span>
          </div>
          <div css={tw`flex gap-4 items-center justify-center`}>
            <span>
              <Link href="/login">
                <a>
                  <HiOutlineUserCircle />
                  <span css={tw`sr-only`}>Login</span>
                </a>
              </Link>
            </span>
            <span>
              <Link href="/cart" passHref>
                <a css={tw`grid grid-cols-2 grid-rows-2 w-6 h-6`} href="/cart">
                  <HiOutlineShoppingCart style={{ gridArea: '1 / 1 / 3 / 3' }} />
                  <span css={tw`h-4 min-width[1rem] px-1 bg-black rounded-full text-white text-xs block font-medium text-center grid-area[2/2/3/3]`}>
                    { cartCount || 0 }
                  </span>
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