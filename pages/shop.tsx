import type { NextPage } from 'next'
import tw, { theme } from 'twin.macro'
import Image from 'next/image'
import { HiOutlineStar } from 'react-icons/hi'

import IMG1 from '@/assets/pexels-bryants-juarez-10154526.jpg'
import IMG2 from '@/assets/pexels-bryants-juarez-10154573.jpg'
import IMG3 from '@/assets/pexels-bryants-juarez-10154575.jpg'

const mockProducts = [
  { title: 'Product a', img: IMG1, price: 1000, stars: 3 },
  { title: 'Product b', img: IMG2, price: 1234, stars: 4 },
  { title: 'Product c', img: IMG3, price: 799, stars: 2 },
  { title: 'Product d', img: IMG1, price: 1000, stars: 3 },
  { title: 'Product e', img: IMG2, price: 1234, stars: 4 },
  { title: 'Product f', img: IMG3, price: 799, stars: 2 },
  { title: 'Product g', img: IMG1, price: 1000, stars: 3 },
  { title: 'Product h', img: IMG2, price: 1234, stars: 4 },
  { title: 'Product i', img: IMG3, price: 799, stars: 2 },
  { title: 'Product j', img: IMG1, price: 1000, stars: 3 },
  { title: 'Product k', img: IMG2, price: 1234, stars: 4 },
  { title: 'Product l', img: IMG3, price: 799, stars: 2 },
  { title: 'Product m', img: IMG1, price: 1000, stars: 3 },
  { title: 'Product n', img: IMG2, price: 1234, stars: 4 },
  { title: 'Product o', img: IMG3, price: 799, stars: 2 },
]

const priceFormatter = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const Shop: NextPage = () => {
  return (
    <div css={tw`grid md:grid-template-columns[1fr 3fr] gap-4`}>
      <div>
        <h1 css={tw`text-2xl font-semibold mb-6`}>Produkte</h1>
        <div>
          <span>Kategorien</span>
        </div>
      </div>
      <div css={tw`grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4`}>
        {
          mockProducts.map((product, i) => (
            <div key={i} css={tw`border border-gray-200 rounded-lg p-4`} className="group">
              <div css={tw`flex justify-center items-center`}>
                <div css={tw`w-80 h-80 overflow-hidden group-hover:scale-105 transition duration-200 rounded relative`}>
                  <Image src={product.img} layout="fill" objectFit="cover" objectPosition="50% 50%" />
                </div>
              </div>
              <div css={tw`mt-4 flex flex-col gap-2`}>
                <div css={tw`flex flex-col`}>
                  <span css={tw`text-xl font-semibold`}>{product.title}</span>
                  <span css={tw`flex gap-0.5 text-yellow-400 text-lg`}>
                  {[...new Array(product.stars)].map((_, i) => (
                    <HiOutlineStar fill={theme`colors.yellow.400`} key={i} />
                  ))}
                  {[...new Array(5 - product.stars)].map((_, i) => (
                    <HiOutlineStar key={i} />
                  ))}
                  </span>
                </div>
                <div css={tw`flex flex-col`}>
                  <span css={tw`text-sm font-light`}>Preis</span>
                  <span css={tw`font-medium text-lg`}>EUR { priceFormatter.format(product.price / 100) }</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Shop