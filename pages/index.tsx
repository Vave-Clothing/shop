import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import { HiOutlineArrowRight, HiOutlineShoppingCart, HiOutlineUserCircle, HiOutlineMenuAlt2 } from 'react-icons/hi'
import Link from 'next/link'
import SideMenu from '@/components/SideMenu'
import { useState } from 'react'
import client, { urlFor } from '@/lib/sanityClient'
import NavBarLogo from '@/components/NavBarLogo'

const footerLinks = [
  { title: 'Zahlungsmöglichkeiten', href: '/paymentmethods' },
  { title: 'AGBs', href: '/terms-of-service' },
  { title: 'Datenschutz', href: '/privacy' },
]

const Home: NextPage = ({ page }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [menu, setMenu] = useState(false)

  const imgSrc = urlFor(page.mainImage).width(1920).height(1080).url()
  
  const objectPositionMainImage = () => {
    return page.mainImage.hotspot.x * 100 + '% ' + page.mainImage.hotspot.y * 100 + '%'
  }

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
            tw`max-w-[110rem] xl:(max-h-[50rem] p-6) h-full w-full text-black`,
            page.mainImageFgColor === 'black' ? tw`xl:text-black` : tw`xl:text-white`
          ]}>
            <div css={tw`flex justify-between text-2xl items-center bg-white xl:(bg-transparent p-0) px-6 py-3`}>
              <div>
                <Link href="/shop" passHref>
                  <a href="/shop">
                    <span css={tw`hidden xl:block`}>
                      {
                        page.mainImageFgColor === 'black' ?
                        <NavBarLogo />
                        :
                        <NavBarLogo inverted={true} />
                      }
                    </span>
                    <span css={tw`block xl:hidden`}>
                      <NavBarLogo />
                    </span>
                  </a>
                </Link>
              </div>
              <div css={tw`flex gap-4 items-center`}>
                <span>
                  <Link href="/auth/login">
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
              <span>&copy; { new Date().getFullYear() } Vave Clothing</span>
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

export const getStaticProps: GetStaticProps = async () => {
  const data = await client.fetch(`
    *[_id == "homePage"]{
      mainImage,
      mainImageFgColor
    }
  `)

  return {
    props: {
      page: data[0]
    },
    revalidate: 60 * 60
  }
}
