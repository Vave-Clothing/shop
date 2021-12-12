import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { HiOutlineArrowDown, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheck, HiOutlineCube, HiOutlineShoppingCart, HiOutlineX } from 'react-icons/hi'
import { Transition } from '@headlessui/react'
import { cx, css } from '@emotion/css'
import client, { urlFor } from '@/lib/sanityClient'
import capitalizeFirstLetter from '@/lib/capitalizeFirstLetter'
import { useShoppingCart } from 'use-shopping-cart'
import Stripe from 'stripe'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const Product: NextPage = ({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { size } = router.query

  const [imgRondell, setImgRondell] = useState(0)
  const [sizeSelector, setSizeSelector] = useState(0)
  const [fitGuide, setFitGuide] = useState(false)
  const { addItem } = useShoppingCart()

  const changeImg = (direction: boolean) => {
    if(direction === true) {
      if(imgRondell !== product.images.length - 1) {
        setImgRondell(imgRondell + 1)
      } else {
        setImgRondell(0)
      }
    } else {
      if(imgRondell !== 0) {
        setImgRondell(imgRondell - 1)
      } else {
        setImgRondell(product.images.length - 1)
      }
    }
  }

  const changeImgSpecific = (number: number) => {
    if(number < 0 && number > product.images.length - 1) return
    setImgRondell(number)
  }

  const modelSize = () => {
    const model = product.variants.find((v:any) => v.isModel === true)
    return model.size
  }

  const addToCart = () => {
    const price = product.variants[sizeSelector].price
    
    const item = {
      id: product.variants[sizeSelector].stripePrice,
      price,
      currency: 'EUR',
      image: urlFor(product.images[0]).width(1920).height(1080).url(),
      imageLQIP: product.imagesLQIP[0],
      name: product.title,
      size: product.variants[sizeSelector].size,
      stock: product.variants[sizeSelector].stock,
      url: `/product/${product.slug}?size=${sizeSelector}`
    }

    toast.promise(
      addItem(item),
      {
        loading: `${product.title} ${product.variants[sizeSelector].size.toUpperCase()} wird hinzugefügt...`,
        success: `${product.title} ${product.variants[sizeSelector].size.toUpperCase()} hinzugefügt`,
        error: 'Da ist etwas schief gelaufen'
      }
    )
  }

  useEffect(() => {
    if(size && Number(size) < product.variants.length) {
      setSizeSelector(Number(size))
      return
    }
    const defaultVariant = product.variants.findIndex((v:any) => v.isDefault === true)
    setSizeSelector(defaultVariant)
  }, [product.variants, size])

  return (
    <div css={tw`grid md:grid-template-columns[3fr 2fr] gap-4`}>
      <div css={tw`grid`} className="group">
        <div css={tw`flex flex-col items-center grid-area[1/1/2/2]`}>
          <div css={tw`md:height[48rem] height[24rem] w-full relative rounded-xl overflow-hidden`}>
            <div css={tw`absolute top-1/2 left-0 right-0 transform -translate-y-1/2 md:flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-200 z-index[+1] px-2 hidden`}>
              <div css={tw`text-xl bg-white bg-opacity-75 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(false)}>
                <HiOutlineArrowLeft />
              </div>
              <div css={tw`text-xl bg-white bg-opacity-75 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(true)}>
                <HiOutlineArrowRight />
              </div>
            </div>
            <div css={tw`absolute top-0 left-0 bottom-0 right-0 z-index[+1] grid grid-cols-2 md:gap-16 gap-8 md:hidden`}>
              <div css={tw`cursor-pointer`} onClick={() => changeImg(false)}></div>
              <div css={tw`cursor-pointer`} onClick={() => changeImg(true)}></div>
            </div>
            {
              product.images.map((img:any, i:number) => (
                <div
                  key={i}
                  css={[
                    tw`transition duration-500`,
                    imgRondell === i ? tw`opacity-100` : tw`opacity-0`
                ]}>
                  <Image src={urlFor(img).width(1342).height(1151).url()} layout="fill" objectFit="cover" objectPosition={img.hotspot.x * 100 + '% ' + img.hotspot.y * 100 + '%'} alt={'Prodcut Image No.' + i} placeholder="blur" blurDataURL={product.imagesLQIP[i]} />
                </div>
              ))
            }
          </div>
        </div>
        <div css={tw`grid-area[1/1/2/2] relative`}>
          <div css={tw`absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5 opacity-75 hover:opacity-100 transition duration-300 z-index[+1]`}>
            {
              product.images.map((_:any, i:number) => (
                <div css={[
                  tw`w-4 h-4 ring-4 ring-white ring-inset rounded-full transition duration-300 cursor-pointer`,
                  i === imgRondell ? tw`bg-black` : tw`bg-white`
                ]} onClick={() => changeImgSpecific(i)} key={i}></div>
              ))
            }
          </div>
        </div>
      </div>
      <div css={tw`relative`}>
        <div css={tw`md:(absolute top-1/2 left[12.5%] transform -translate-y-1/2)`}>
          <div>
            <span css={tw`text-sm font-light`}>
              { capitalizeFirstLetter(product.category) } &ndash; { product.collection.name }
            </span>
            <h1 css={tw`text-3xl font-semibold`}>
              { product.title }
            </h1>
            <span>
              { product.blurb }
            </span>
          </div>
          <div css={tw`mt-4`}>
            {
              product.variants[sizeSelector].isDifferent &&
              <span css={tw`text-red-500 line-through text-sm font-light block`}>EUR { priceFormatter.format(product.variants[sizeSelector].price / 100) }</span>
            }
            <h2 css={tw`text-xl font-medium`}>EUR { priceFormatter.format(product.variants[sizeSelector].resPrice / 100) }</h2>
            {(() => {
              const val = product.variants[sizeSelector].stock

              switch (true) {
                case ( val > 5 ):
                  return (
                    <span css={tw`flex leading-tight items-center text-green-500 gap-1 text-sm`}><HiOutlineCheck /> Lieferbar</span>
                  )
                case ( val <= 5 && val > 0 ):
                  return (
                    <span css={tw`flex leading-tight items-center text-yellow-500 gap-1 text-sm`}><HiOutlineCube /> Noch { val } auf Lager</span>
                  )
                case ( val < 1 ):
                  return (
                    <span css={tw`flex leading-tight items-center text-red-500 gap-1 text-sm`}><HiOutlineX /> Nicht Lieferbar</span>
                  )
              }
            })()}
          </div>
          <div css={tw`mt-4`}>
            <div css={tw`flex items-center gap-2 flex-wrap`}>
              <div css={tw`flex items-center gap-2 border border-gray-200 w-max rounded-lg p-0.5 text-sm`}>
                {
                  product.variants.map((v:any, i:number) => (
                    <span
                      css={[
                        tw`uppercase rounded-lg px-3 py-1 cursor-pointer transition duration-300`,
                        
                        v.stock < 1 ?
                        sizeSelector === i ? tw`bg-red-200` : tw`bg-red-100 cursor-not-allowed hover:(ring ring-inset ring-transparent ring-offset-1 ring-offset-red-200)`
                        :
                        sizeSelector === i ? tw`bg-gray-200` : tw`hover:(ring ring-inset ring-transparent ring-offset-1 ring-offset-gray-200)`
                      ]}
                      key={v._key}
                      onClick={() => {
                        if(v.stock < 1) return
                        setSizeSelector(i)
                      }}
                    >
                      {v.size}
                    </span>
                  ))
                }
              </div>
              <button css={tw`flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1`} onClick={() => setFitGuide(!fitGuide)}>
                <span css={[tw`transition duration-300 transform`, fitGuide ? tw`rotate-180` : tw`rotate-0`]}>
                  <HiOutlineArrowDown />
                </span>
                <span>Fit-Guide</span>
              </button>
            </div>
            <Transition
              show={fitGuide}
              {...{
                enter: cx(css(tw`transition-opacity duration-300`)),
                enterFrom: cx(css(tw`opacity-0`)),
                enterTo: cx(css(tw`opacity-100`)),
              }}
            >
              <div css={tw`border border-gray-100 rounded-lg mt-1 px-2 py-1`}>
                <span css={tw`mb-1 block`}>Fit-Guide</span>
                <table css={tw`w-full border-collapse text-sm`}>
                  <tbody>
                    <tr css={tw`border-b border-gray-100`}>
                      <th css={tw`text-xs font-normal text-left`}>in cm</th>
                      {
                        product.variants.map((v:any, i:number) => (
                          <th key={v._key} css={tw`font-normal uppercase text-center`}>
                            {v.size}
                          </th>
                        ))
                      }
                    </tr>
                    <tr css={tw`border-b border-gray-100`}>
                      <td css={tw`font-normal uppercase`}>Chest</td>
                      {
                        product.variants.map((v:any, i:number) => (
                          <td key={v._key}>{v.mesurements.chest}</td>
                        ))
                      }
                    </tr>
                    <tr>
                      <td css={tw`font-normal uppercase`}>Waist</td>
                      {
                        product.variants.map((v:any, i:number) => (
                          <td key={v._key}>{v.mesurements.waist}</td>
                        ))
                      }
                    </tr>
                  </tbody>
                </table>
                <span css={tw`block mt-2 text-sm font-light`}>Model trägt Größe { modelSize().toUpperCase() }</span>
              </div>
            </Transition>
            <button css={tw`border border-gray-300 bg-gray-50 py-1 px-4 rounded-lg mt-3 flex items-center gap-2 text-lg`} onClick={() => addToCart()}>
              <HiOutlineShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await client.fetch(`
    *[_type == "product" && slug.current == "${ctx.params?.slug}"]{
      _id,
      blurb,
      body,
      category,
      collection->{
        name
      },
      images,
      tags,
      title,
      variants[]{
        _key,
        isDefault,
        isModel,
        mesurements,
        price,
        size,
        stock,
        stripePrice
      },
      'imagesLQIP': images[].asset->metadata.lqip,
      slug
    }
  `)

  const resolvedStripePrices = await Promise.all(data[0].variants.map(async (v:any) => {
    const stripe = new Stripe(process.env.STRIPE_SK!, {
      apiVersion: '2020-08-27',
    })

    const { _key, isDefault, isModel, mesurements, price, size, stock, stripePrice } = v

    const defaultPrice = price * 100
    const resPrice = await (await stripe.prices.retrieve(stripePrice)).unit_amount

    const isDifferent = () => {
      if(defaultPrice !== resPrice) return true
      return false
    }

    return {
      _key,
      isDefault,
      isModel,
      mesurements,
      price: defaultPrice,
      size,
      stock,
      stripePrice,
      resPrice,
      isDifferent: isDifferent()
    }
  }))

  const formattedData = {
    _id: data[0]._id,
    blurb: data[0].blurb,
    body: data[0].body,
    category: data[0].category,
    collection: data[0].collection,
    images: data[0].images,
    tags: data[0].tags,
    title: data[0].title,
    variants: resolvedStripePrices,
    imagesLQIP: data[0].imagesLQIP,
    slug: data[0].slug.current
  }

  return {
    props: {
      product: formattedData
    }
  }
}
