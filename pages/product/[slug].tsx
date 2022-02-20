import type { NextPage, GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { HiOutlineArrowDown, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheck, HiOutlineCreditCard, HiOutlineCube, HiOutlineShoppingCart, HiOutlineX } from 'react-icons/hi'
import client, { urlFor } from '@/lib/sanityClient'
import capitalizeFirstLetter from '@/lib/capitalizeFirstLetter'
import { useShoppingCart } from 'use-shopping-cart'
import Stripe from 'stripe'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Button from '@/components/Button'
import serializers from '@/lib/sanityBlockContent'
import BlockContent from '@sanity/block-content-to-react'
import { formatPrice } from '@/lib/priceFormatter'
import FallbackPage from '@/components/FallbackPage'
import useWindowDimensions from '@/lib/useWindowDimensions'
import Dialog from '@/components/Dialog'

const Product: NextPage = ({ product }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { width } = useWindowDimensions()

  const router = useRouter()
  const { size } = router.query

  const [imgRondell, setImgRondell] = useState(0)
  const [sizeSelector, setSizeSelector] = useState(0)
  const { addItem, cartDetails } = useShoppingCart()
  const detailsEl = useRef<HTMLHeadingElement>(null)

  const [imgDialog, setImgDialog] = useState(false)

  const cart = Object.keys(cartDetails).map((key) => {
    const { id, quantity } = cartDetails[key]
    return { id, quantity }
  })

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

  const addToCart = (dc?: boolean) => {
    const cartFind = cart.find(i => i.id === product.variants[sizeSelector].stripePrice)

    if(cartFind?.quantity >= product.variants[sizeSelector].stock) return toast.error('Die maximale Anzahl von diesem Produkt ist erreicht')

    const price = product.variants[sizeSelector].resPrice
    
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

    addItem(item)

    // timeout for browser to register a change in shopping cart
    if(dc === true) return setTimeout(() => { router.push('/checkout/begin') }, 100)
    toast.success(`${product.title} ${product.variants[sizeSelector].size.toUpperCase()} hinzugefügt`)
  }

  const getDetailsElTopPosition = () => {
    const rect = detailsEl.current?.getBoundingClientRect()
    return rect?.top
  }

  const scrollToDetails = () => {
    const top = Number(getDetailsElTopPosition())
    const app = document.getElementById('app')
    const navBar = document.getElementById('navBar')

    if(app?.scrollTop !== 0) return
    if(document.body.offsetWidth < 1280) {
      window.scrollTo({
        left: 0,
        top: top - Number(navBar?.offsetHeight) - 10,
        behavior: 'smooth'
      })
    }
    app.scrollTo({
      left: 0,
      top: top - Number(navBar?.offsetHeight) - 10,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    if(!product) return
    if(size && Number(size) < product.variants.length) {
      setSizeSelector(Number(size))
      return
    }
    const defaultVariant = product.variants.findIndex((v:any) => v.isDefault === true)
    setSizeSelector(defaultVariant)
  }, [product, size])

  if(router.isFallback) {
    return <FallbackPage />
  }

  return (
    <div>
      <div css={tw`grid lg:grid-template-columns[1fr 1fr] gap-4`}>
        {
          width <= 1024 ? (
            <div css={tw`grid`} className="group">
              <div css={tw`flex flex-col items-center grid-area[1/1/2/2]`}>
                <div css={tw`md:height[46rem] height[24rem] w-full relative rounded-xl overflow-hidden`}>
                  <div css={tw`absolute top-1/2 left-0 right-0 transform -translate-y-1/2 md:flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-200 z-index[+1] px-2 hidden`}>
                    <div css={tw`text-xl bg-white text-black bg-opacity-75 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(false)}>
                      <HiOutlineArrowLeft />
                    </div>
                    <div css={tw`text-xl bg-white text-black bg-opacity-75 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(true)}>
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
          ) : (
            <div css={tw`flex flex-col gap-4 items-center`}>
              {
                product.images.map((img:any, i:number) => {
                  if(i > 2) return
                  return (
                    <div css={tw`height[46rem] w-full relative rounded-xl overflow-hidden`} key={i}>
                      <Image src={urlFor(img).width(1104).height(1104).url()} layout="fill" objectFit="cover" objectPosition={img.hotspot.x * 100 + '% ' + img.hotspot.y * 100 + '%'} alt={'Prodcut Image No. ' + i} placeholder="blur" blurDataURL={product.imagesLQIP[i]} />
                    </div>
                  )
                })
              }
              {
                product.images.length > 3 ? (
                  <button css={tw`text-gray-500 dark:text-gray-600`} onClick={() => setImgDialog(true)}>+{ product.images.length - 3 } anzeigen</button>
                ) : (<></>)
              }
              <Dialog show={imgDialog} onClose={() => setImgDialog(false)} width="5xl">
                <div css={tw`grid grid-template-columns[3fr auto]`}>
                  <div className='group'>
                    <div css={tw`width[46.125rem] height[46.125rem] w-full relative rounded-xl overflow-hidden`}>
                      <div css={tw`absolute top-1/2 left-0 right-0 transform -translate-y-1/2 md:flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-200 z-index[+1] px-2 hidden`}>
                        <div css={tw`text-xl bg-white text-black bg-opacity-75 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(false)}>
                          <HiOutlineArrowLeft />
                        </div>
                        <div css={tw`text-xl bg-white text-black bg-opacity-75 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(true)}>
                          <HiOutlineArrowRight />
                        </div>
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
                  <div css={tw`border-l border-gray-200 dark:border-gray-700 pl-2 ml-2`}>
                    <button css={tw`ml-auto block text-xl text-gray-500 mb-2`} onClick={() => setImgDialog(false)}>
                      <HiOutlineX />
                    </button>
                    <div css={tw`grid grid-cols-3 gap-0.5`}>
                      {
                        product.images.map((img:any, i:number) => (
                          <button
                            key={i}
                            css={[
                              tw`block relative height[5.125rem] width[5.125rem] border border-gray-200 ring-gray-400 dark:(border-gray-700 ring-gray-500)`,
                              i === imgRondell ? tw`ring-2` : tw``
                            ]}
                            onClick={() => changeImgSpecific(i)}
                          >
                            <Image src={urlFor(img).width(123).height(123).url()} layout="fill" objectFit="cover" objectPosition={img.hotspot.x * 100 + '% ' + img.hotspot.y * 100 + '%'} alt={'Prodcut Image No.' + i} placeholder="blur" blurDataURL={product.imagesLQIP[i]} />
                          </button>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </Dialog>
            </div>
          )
        }
        <div>
          <div css={tw`relative lg:(py-4 px-4 height[46rem])`}>
            <div css={tw`lg:(absolute top-1/2 left[12.5%] transform -translate-y-1/2)`}>
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
                  <span css={tw`text-red-500 line-through text-sm font-light block`}>EUR { formatPrice(product.variants[sizeSelector].price / 100) }</span>
                }
                <h2 css={tw`text-xl font-medium`}>EUR { formatPrice(product.variants[sizeSelector].resPrice / 100) }</h2>
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
                  <div css={tw`flex items-center gap-2 border border-gray-200 dark:border-gray-700 w-max rounded-lg p-0.5 text-sm shadow-sm mt-3 h-9`}>
                    {
                      product.variants.map((v:any, i:number) => (
                        <button
                          css={[
                            tw`uppercase rounded-lg px-3 py-1 cursor-pointer transition duration-300`,
                            tw`focus:outline-none focus-visible:(ring-2 ring-gray-400 dark:ring-gray-500)`,
                            tw`hover:(ring ring-inset ring-transparent ring-offset-1 ring-offset-gray-300 dark:ring-offset-gray-600)`,
                            tw`disabled:(bg-red-100 cursor-not-allowed hover:(ring ring-inset ring-transparent ring-offset-1 ring-offset-red-300) dark:(bg-red-700 hover:ring-offset-red-500))`,
                            sizeSelector === i ? tw`bg-gray-200 disabled:bg-red-200 dark:(bg-gray-700 disabled:bg-red-800)` : tw``,
                          ]}
                          key={v._key}
                          onClick={() => {
                            setSizeSelector(i)
                          }}
                          disabled={v.stock < 1}
                        >
                          {v.size}
                        </button>
                      ))
                    }
                  </div>
                </div>
                <div css={tw`flex gap-2 flex-wrap`}>
                  <Button onClick={() => addToCart()} type='primary' shimmering={true}>
                    <>
                      <HiOutlineShoppingCart />
                      <span>Add to Cart</span>
                    </>
                  </Button>
                  <Button type='secondary' onClick={() => addToCart(true)}>
                    <>
                      <HiOutlineCreditCard />
                      <span>Jetzt kaufen</span>
                    </>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div css={tw`mt-8`}>
            <div css={tw`items-center justify-center lg:flex hidden`}>
              <button css={[
                tw`p-2 text-xl border border-gray-200 rounded-full shadow transition duration-200 ring-gray-400 hover:(border-gray-300) active:(border-gray-500) dark:(border-gray-700 ring-gray-500 hover:border-gray-600)`,
                tw`focus:outline-none focus-visible:ring-3`
              ]} onClick={() => scrollToDetails()}>
                <HiOutlineArrowDown />
              </button>
            </div>
            <h1 css={tw`text-4xl font-semibold mt-6 mb-4`} ref={detailsEl}>
              Produktdetails
            </h1>
            <BlockContent
              blocks={product.body}
              serializers={{...serializers}}
            />
            <h2 css={tw`text-3xl font-semibold mt-6 mb-4`}>
              Größentabelle
            </h2>
            <table css={tw`w-full border-collapse md:max-w-2xl max-w-xl text-sm md:text-base`}>
              <tbody>
                <tr css={tw`border-b border-gray-200 dark:border-gray-700`}>
                  <th css={tw`md:text-sm text-xs font-normal text-left`}>in cm</th>
                  {
                    product.variants.map((v:any) => (
                      <th key={v._key} css={tw`font-normal uppercase text-center`}>
                        {v.size}
                      </th>
                    ))
                  }
                </tr>
                <tr css={tw`border-b border-gray-200 dark:border-gray-700`}>
                  <td css={tw`font-normal uppercase`}>Chest</td>
                  {
                    product.variants.map((v:any) => (
                      <td key={v._key} css={tw`text-center`}>{v.mesurements.chest}</td>
                    ))
                  }
                </tr>
                <tr>
                  <td css={tw`font-normal uppercase`}>Waist</td>
                  {
                    product.variants.map((v:any) => (
                      <td key={v._key} css={tw`text-center`}>{v.mesurements.waist}</td>
                    ))
                  }
                </tr>
              </tbody>
            </table>
            <span css={tw`block mt-2 text-sm md:text-base font-light`}>Model trägt Größe { modelSize().toUpperCase() }</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product

export const getStaticProps: GetStaticProps = async (ctx) => {
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

  if(data.length < 1) return { notFound: true }

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
    },
    revalidate: 60 * 30
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await client.fetch(`
    *[_type == "product"]{
      slug
    }
  `)

  const slugs = products.map((product: any) => ({
    params: { slug: product.slug.current }
  }))

  return {
    paths: slugs,
    fallback: true
  }
}
