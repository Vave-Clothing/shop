import type { NextPage } from 'next'
import tw, { theme } from 'twin.macro'
import Image from 'next/image'
import { HiOutlineStar } from 'react-icons/hi'
import Link from 'next/link'
import { Fragment, useState, useRef, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'

import IMG1 from '@/assets/pexels-bryants-juarez-10154526.jpg'
import IMG2 from '@/assets/pexels-bryants-juarez-10154573.jpg'
import IMG3 from '@/assets/pexels-bryants-juarez-10154575.jpg'

const mockProducts = [
  { title: 'Product a', img: IMG1, price: 1000, stars: 3, fBCount: 100, href: '/product', inStock: true, category: 'hoodies' },
  { title: 'Product b', img: IMG2, price: 1234, stars: 4, fBCount: 50, href: '/product', inStock: true, category: 'hoodies2' },
  { title: 'Product c', img: IMG3, price: 799, stars: 2, fBCount: 75, href: '/product', inStock: false, category: 'hoodies3' },
  { title: 'Product d', img: IMG1, price: 1000, stars: 3, fBCount: 234, href: '/product', inStock: true, category: 'hoodies' },
  { title: 'Product e', img: IMG2, price: 1234, stars: 4, fBCount: 654, href: '/product', inStock: true, category: 'hoodies2' },
  { title: 'Product f', img: IMG3, price: 799, stars: 2, fBCount: 123, href: '/product', inStock: true, category: 'hoodies3' },
  { title: 'Product g', img: IMG1, price: 1000, stars: 3, fBCount: 634, href: '/product', inStock: false, category: 'hoodies' },
  { title: 'Product h', img: IMG2, price: 1234, stars: 4, fBCount: 194, href: '/product', inStock: true, category: 'hoodies2' },
  { title: 'Product i', img: IMG3, price: 799, stars: 2, fBCount: 55, href: '/product', inStock: true, category: 'hoodies3' },
  { title: 'Product j', img: IMG1, price: 1000, stars: 3, fBCount: 24, href: '/product', inStock: true, category: 'hoodies' },
  { title: 'Product k', img: IMG2, price: 1234, stars: 4, fBCount: 43, href: '/product', inStock: true, category: 'hoodies2' },
  { title: 'Product l', img: IMG3, price: 799, stars: 2, fBCount: 754, href: '/product', inStock: true, category: 'hoodies3' },
  { title: 'Product m', img: IMG1, price: 1000, stars: 3, fBCount: 243, href: '/product', inStock: false, category: 'hoodies' },
  { title: 'Product n', img: IMG2, price: 1234, stars: 4, fBCount: 43, href: '/product', inStock: true, category: 'hoodies2' },
  { title: 'Product o', img: IMG3, price: 799, stars: 2, fBCount: 243, href: '/product', inStock: true, category: 'hoodies3' },
]

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

const Shop: NextPage = () => {
  const [products, setProducts] = useState(mockProducts)
  const [category, setCategory] = useState('all')
  const categoryPanel = useRef<HTMLDivElement>(null)
  const [categoryPanelTop, setCategoryPanelTop] = useState(0)

  const sortProducts = (sort: string) => {
    setCategory(sort)
    const filtered = mockProducts.filter(p => p.category === sort)
    if(sort === 'all') return setProducts(mockProducts)
    setProducts(filtered)
  }

  const getCategoryPanelTopPosition = () => {
    const rect = categoryPanel.current?.getBoundingClientRect()
    return rect?.top
  }

  useEffect(() => {
    setCategoryPanelTop(Number(getCategoryPanelTopPosition()))
  }, [])

  return (
    <div css={tw`grid md:grid-template-columns[1fr 3fr] gap-4`}>
      <div css={tw`mb-4 md:m-0`}>
        <div css={tw`md:sticky`} ref={categoryPanel} style={{ top: categoryPanelTop }}>
          <h1 css={tw`text-2xl font-semibold mb-6`}>Produkte</h1>
          <div>
            <RadioGroup value={category} onChange={sortProducts}>
              <RadioGroup.Label as={Fragment}>
                <span css={tw`block mb-1`}>Kategorien</span>
              </RadioGroup.Label>
              <div css={tw`ml-1`}>
                <RadioButton value="all" title="Alle" />
                <RadioButton value="hoodies" title="Hoodies" />
                <RadioButton value="hoodies2" title="Hoodies 2" />
                <RadioButton value="hoodies3" title="Hoodies 3" />
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      <div css={tw`grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4`}>
        {
          products.map((product, i) => (
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