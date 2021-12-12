import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import tw, { theme } from 'twin.macro'
import Image from 'next/image'
import { HiOutlineStar } from 'react-icons/hi'
import Link from 'next/link'
import { Fragment, useState, useRef, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import client, { urlFor } from '@/lib/sanityClient'
import Stripe from 'stripe'

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

interface radioButtonProps {
  title: string,
  value: string
}

interface imgHotspotFunction {
  _type: string,
  height: number,
  width: number,
  x: number,
  y: number
}

const RadioButton = ({ title, value }: radioButtonProps) => {
  return (
    <RadioGroup.Option value={value} as={Fragment}>
      {({checked}) => (
        <div css={tw`flex items-center gap-1 cursor-pointer`}>
            <span css={[
              tw`w-4 h-4 block rounded-full ring ring-white ring-offset-1 ring-offset-black ring-inset transition duration-200`,
              checked ? tw`bg-black` : tw`bg-white`
            ]}></span>
          <span>{title}</span>
        </div>
      )}
    </RadioGroup.Option>
  )
}

const Shop: NextPage = ({ shopProducts, shopCollections }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [products, setProducts] = useState(shopProducts)
  const [collection, setCollection] = useState('all')
  const collectionsPanel = useRef<HTMLDivElement>(null)
  const [collectionsPanelTop, setCollectionsPanelTop] = useState(0)

  const sortProducts = (sort: string) => {
    setCollection(sort)
    const filtered = shopProducts.filter((p:any) => p.collectionId === sort)
    if(sort === 'all') return setProducts(shopProducts)
    setProducts(filtered)
  }

  const getCategoryPanelTopPosition = () => {
    const rect = collectionsPanel.current?.getBoundingClientRect()
    return rect?.top
  }

  const imgHotspot = (hotsp: imgHotspotFunction) => {
    return hotsp.x * 100 + '% ' + hotsp.y * 100 + '%'
  }

  useEffect(() => {
    setCollectionsPanelTop(Number(getCategoryPanelTopPosition()))
  }, [])

  return (
    <div css={tw`grid md:grid-template-columns[1fr 3fr] gap-4`}>
      <div css={tw`mb-4 md:m-0`}>
        <div css={tw`md:sticky`} ref={collectionsPanel} style={{ top: collectionsPanelTop }}>
          <h1 css={tw`text-2xl font-semibold mb-6`}>Produkte</h1>
          <div>
            <RadioGroup value={collection} onChange={sortProducts}>
              <RadioGroup.Label as={Fragment}>
                <span css={tw`block mb-1`}>Collections</span>
              </RadioGroup.Label>
              <div css={tw`ml-1`}>
                <RadioButton value="all" title="Alle" />
                {
                  shopCollections.map((c:any) => (
                    <RadioButton value={c._id} title={c.name} key={c._id} />
                  ))
                }
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      <div css={tw`grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4`}>
        {
          products.map((product: any, i: number) => (
            <div key={i} css={tw`border border-gray-200 rounded-lg p-4 relative`} className="group">
              <div css={tw`flex justify-center items-center`}>
                <div css={tw`w-80 h-80 overflow-hidden group-hover:scale-105 transition duration-200 rounded relative`}>
                  <Image src={product.img} layout="fill" objectFit="cover" objectPosition={imgHotspot(product.imgHotspot)} alt={product.title} placeholder="blur" blurDataURL={product.imgLQIP} />
                </div>
              </div>
              <div css={tw`mt-4 flex flex-col gap-2`}>
                <div css={tw`flex flex-col`}>
                  <span css={tw`text-xl font-semibold`}>
                    {product.title}
                  </span>
                  <span css={tw`flex gap-0.5 text-lg items-center`}>
                    {[...new Array(product.stars)].map((_, i) => (
                      <HiOutlineStar fill={theme`colors.yellow.400`} color={theme`colors.yellow.400`} key={i} />
                    ))}
                    {[...new Array(5 - product.stars)].map((_, i) => (
                      <HiOutlineStar color={theme`colors.yellow.400`} key={i} />
                    ))}
                    <span css={tw`text-gray-300 text-xs ml-1`}>({product.fBCount})</span>
                  </span>
                </div>
                <div css={tw`flex flex-col`}>
                  <span css={tw`text-sm font-light`}>
                    Preis
                    {
                      !product.inStock &&
                      <span css={tw`ml-1 inline-flex gap-1 items-center justify-center text-xs`}><span>–</span><span css={tw`text-red-400`}>Manche Größen sind ausverkauft</span></span>
                    }
                  </span>
                  <span css={tw`font-medium text-lg flex items-center gap-1.5`}>
                    <span>
                      EUR { priceFormatter.format(product.price / 100) }
                    </span>
                    {
                      product.price !== product.defaultPrice &&
                      <span css={tw`text-sm font-light line-through text-red-400`}>
                        EUR { priceFormatter.format(product.defaultPrice / 100) }
                      </span>
                    }
                  </span>
                </div>
              </div>
              <Link href={product.href} passHref>
                <a href={product.href} css={tw`absolute top-0 left-0 bottom-0 right-0`}>
                  <span css={tw`sr-only`}>{product.title}</span>
                </a>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Shop

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const stripe = new Stripe(process.env.STRIPE_SK!, {
    apiVersion: '2020-08-27',
  })

  const products = await client.fetch(`
    *[_type == "product"]{
      _id,
      blurb,
      category,
      collection,
      images,
      slug,
      tags,
      title,
      variants,
      'imagesLQIP': images[].asset->metadata.lqip
    }
  `)

  const formattedProducts = await Promise.all(products.map(async (p:any) => {
    const main = p.variants.find((v:any) => v.isDefault === true)
    const img = urlFor(p.images[0]).width(640).height(640).url()

    const stock = p.variants.map((v:any) => {
      return v.stock
    })
    const emtpyStock = () => {
      if (stock.find((s:number) => s < 1) !== undefined) return false
      return true
    }

    const cPrice = await (await stripe.prices.retrieve(main.stripePrice)).unit_amount

    return {
      title: p.title,
      img: img,
      price: cPrice,
      defaultPrice: main.price * 100,
      stars: 5,
      fBCount: 5,
      href: '/product/' + p.slug.current,
      inStock: emtpyStock(),
      category: p.category,
      collectionId: p.collection._ref,
      imgHotspot: p.images[0].hotspot,
      imgLQIP: p.imagesLQIP[0]
    }
  }))

  const collections = await client.fetch(`
    *[_type == "collection"]{
      _id,
      name
    }
  `)

  return {
    props: {
      shopProducts: formattedProducts,
      shopCollections: collections
    }
  }
}
