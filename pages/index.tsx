import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import { HiOutlineArrowRight, HiOutlineShoppingCart, HiOutlineUserCircle, HiOutlineMenuAlt2 } from 'react-icons/hi'
import Link from 'next/link'
import SideMenu from '@/components/SideMenu'
import { useState, useLayoutEffect, useRef } from 'react'
import moment from 'moment-timezone'
import client, { urlFor } from '@/lib/sanityClient'
import Logo from '@/assets/vave-logo-head-fit.svg'
import LogoInverted from '@/assets/vave-logo-head-fit-inverted.svg'
import { gsap } from 'gsap'

const footerLinks = [
  { title: 'Link1', href: '/' },
  { title: 'Link2', href: '/' },
  { title: 'Link3', href: '/' },
  { title: 'Link4', href: '/' },
]

const Home: NextPage = ({ page }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [menu, setMenu] = useState(false)
  const svg = useRef(null)
  const q = gsap.utils.selector(svg)

  const imgSrc = urlFor(page.mainImage).width(1920).height(1080).url()
  
  const objectPositionMainImage = () => {
    return page.mainImage.hotspot.x * 100 + '% ' + page.mainImage.hotspot.y * 100 + '%'
  }

  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { opacity: 0 } })
    tl.fromTo(q("#background"), { opacity: 0 }, { opacity: 1, delay: .5 })
    tl.fromTo(q("#foreground"), { opacity: 0, scale: 1.25, transformOrigin: "center" }, { opacity: 1, scale: 1 })
  }, [])

  return (
    <>
      <SideMenu open={menu} close={setMenu} />
      <div css={tw`min-h-screen w-full grid`}>
        <div css={tw`grid-area[1/1/2/2] h-screen overflow-hidden`}>
          <Image src={imgSrc} layout="fill" objectFit="cover" objectPosition={objectPositionMainImage()} alt={page.mainImage.caption} priority={true} />
        </div>
        <div css={tw`grid-area[1/1/2/2] z-index[1]`}>
          <div css={[
            tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`,
            tw`max-w-[110rem] xl:max-h-[50rem] h-full w-full text-black xl:p-6`,
            page.mainImageFgColor === 'black' ? tw`xl:text-black` : tw`xl:text-white`
          ]}>
            <div css={tw`flex justify-between text-2xl items-center bg-white xl:bg-transparent px-6 py-3 xl:p-0`}>
              <div>
                <span ref={svg}>
                  <span css={tw`hidden xl:block`}>
                    {
                      page.mainImageFgColor === 'black' ?
                      <Logo id="logo_head" />
                      :
                      <LogoInverted id="logo_head" />
                    }
                  </span>
                  <span css={tw`block xl:hidden`}>
                    <Logo id="logo_head" />
                  </span>
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
              <span>&copy; { moment().tz('Europe/Berlin').format('yyyy') } Vave Clothing</span>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await client.fetch(`
    *[_id == "homePage"]{
      mainImage,
      mainImageFgColor
    }
  `)

  return {
    props: {
      page: data[0]
    }
  }
}
