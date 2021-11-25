import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import tw, { theme } from 'twin.macro'
import Image from 'next/image'
import { HiOutlineStar } from 'react-icons/hi'
import Link from 'next/link'
import { Fragment, useState, useRef, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import client, { urlFor } from '@/lib/sanityClient'

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

interface radioButtonProps {
  title: string,
  value: string
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
                  <Image src={product.img} layout="fill" objectFit="cover" objectPosition="50% 50%" alt={product.title} />
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
                  <span css={tw`text-sm font-light`}>Preis</span>
                  <span css={tw`font-medium text-lg flex items-center gap-1.5`}>
                    <span css={[product.inStock ? '' : tw`text-gray-500 line-through text-sm`]}>
                      EUR { priceFormatter.format(product.price / 100) }
                    </span>
                    {
                      !product.inStock &&
                      <span css={tw`text-red-500`}>OUT OF STOCK</span>
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
      variants
    }
  `)

  const formattedProducts = products.map((p:any) => {
    const main = p.variants.find((v:any) => v.isDefault === true)
    const img = urlFor(p.images[0]).width(640).height(640).url()

    // TODO: Stock message for under 5

    return {
      title: p.title,
      img: img,
      price: main.price * 100,
      stars: 5,
      fBCount: 5,
      href: '/product/' + p.slug.current,
      inStock: true,
      category: p.category,
      collectionId: p.collection._ref
    }
  })

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
