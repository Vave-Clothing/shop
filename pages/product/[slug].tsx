import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { HiOutlineArrowDown, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineShoppingCart } from 'react-icons/hi'
import { Transition } from '@headlessui/react'
import { cx, css } from '@emotion/css'
import client, { urlFor } from '@/lib/sanityClient'
import capitalizeFirstLetter from '@/lib/capitalizeFirstLetter'

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const Product: NextPage = ({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [imgRondell, setImgRondell] = useState(0)
  const [sizeSelector, setSizeSelector] = useState(0)
  const [fitGuide, setFitGuide] = useState(false)

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
    const alertBox = {
      currentVariant: sizeSelector,
      currentPriceId: product.variants[sizeSelector].stripePrice
    }
    alert(JSON.stringify(alertBox, null, 2))
  }

  useEffect(() => {
    const defaultVariant = product.variants.findIndex((v:any) => v.isDefault === true)
    setSizeSelector(defaultVariant)
  }, [])

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
            <span css={tw`text-red-500 line-through text-sm font-light`}>EUR { priceFormatter.format(product.variants[sizeSelector].price) }</span>
            <h2 css={tw`text-xl font-medium`}>EUR { priceFormatter.format(product.variants[sizeSelector].price) }</h2>
          </div>
          <div css={tw`mt-4`}>
            <div css={tw`flex items-center gap-2 flex-wrap`}>
              <div css={tw`flex items-center gap-2 border border-gray-200 w-max rounded-lg p-0.5 text-sm`}>
                {
                  product.variants.map((v:any, i:number) => (
                    <span css={[
                      tw`uppercase rounded-lg px-3 py-1 cursor-pointer transition duration-300`,
                      sizeSelector === i ? tw`bg-gray-200` : tw`hover:(ring ring-inset ring-transparent ring-offset-1 ring-offset-gray-200)`
                    ]} key={v._key} onClick={() => setSizeSelector(i)}>
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
      'imagesLQIP': images[].asset->metadata.lqip
    }
  `)

  return {
    props: {
      product: data[0]
    }
  }
}
