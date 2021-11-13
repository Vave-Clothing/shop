import type { NextPage } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import MainImage from '@/assets/larry-george-ii-7hazmb7YznI-unsplash.jpg'
import { HiOutlineArrowRight, HiOutlineShoppingCart, HiOutlineUserCircle, HiOutlineMenuAlt2 } from 'react-icons/hi'
import Link from 'next/link'
import SideMenu from '@/components/SideMenu'
import { useState } from 'react'
import moment from 'moment-timezone'

const footerLinks = [
  { title: 'Link1', href: '/' },
  { title: 'Link2', href: '/' },
  { title: 'Link3', href: '/' },
  { title: 'Link4', href: '/' },
]

const Home: NextPage = () => {
  const [menu, setMenu] = useState(false)

  return (
    <>
      <SideMenu open={menu} close={setMenu} />
      <div css={tw`min-h-screen w-full grid`}>
        <div css={tw`grid-area[1/1/2/2] h-screen overflow-hidden`}>
          <Image src={MainImage} layout="fill" objectFit="cover" objectPosition="50% 50%" alt="Main Image" priority={true} />
        </div>
        <div css={tw`grid-area[1/1/2/2] z-index[1]`}>
          <div css={[
            tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`,
            tw`max-w-[110rem] xl:max-h-[50rem] h-full w-full text-black xl:p-6`
          ]}>
            <div css={tw`flex justify-between text-2xl items-center bg-white xl:bg-transparent px-6 py-3 xl:p-0`}>
              <div><span>LOGO</span></div>
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
                  <button onClick={() => setMenu(true)}>
                    <HiOutlineMenuAlt2 />
                    <span css={tw`sr-only`}>Menü öffnen</span>
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div css={[
            tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`,
            tw`bg-black text-white py-3 px-6 text-xl font-semibold uppercase flex items-center gap-2 whitespace-nowrap`
          ]}>
            <span>Zum Shop</span>
            <HiOutlineArrowRight />
            <Link href="/shop" passHref>
              <a css={tw`absolute top-0 left-0 bottom-0 right-0 flex-none`} href="/shop"></a>
            </Link>
          </div>
          <div css={[
            tw`absolute bottom-0`,
            tw`w-full bg-white`
          ]}>
            <div css={[
              tw`relative left-1/2 transform -translate-x-1/2`,
              tw`max-w-[110rem] w-full text-gray-400 px-2 py-1 flex justify-between items-center`
            ]}>
              <span>&copy; { moment().tz('Europe/Berlin').format('yyyy') } Brand</span>
              <div css={tw`flex items-center gap-2`}>
                {
                  footerLinks.map((link, i) => (
                    <Link href={link.href} key={i}>
                      {link.title}
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
