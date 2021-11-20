import type { NextPage } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { HiOutlineArrowDown, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineShoppingCart } from 'react-icons/hi'
import { Transition } from '@headlessui/react'
import { cx, css } from '@emotion/css'

import IMG1 from '@/assets/pexels-bryants-juarez-10154526.jpg'
import IMG2 from '@/assets/pexels-bryants-juarez-10154573.jpg'
import IMG3 from '@/assets/pexels-bryants-juarez-10154575.jpg'

const mockImages = [
  { src: IMG1 },
  { src: IMG2 },
  { src: IMG3 },
]

const mockSizes = [
  { size: 'xs', chest: '34-38', waist: '30-32' },
  { size: 's', chest: '28-40', waist: '32-33' },
  { size: 'm', chest: '42-44', waist: '33-34' },
  { size: 'l', chest: '46-48', waist: '36-38' },
  { size: 'xl', chest: '48-50', waist: '40-42' }
]

const Product: NextPage = () => {
  const [imgRondell, setImgRondell] = useState(0)
  const [sizeSelector, setSizeSelector] = useState(0)
  const [fitGuide, setFitGuide] = useState(false)

  const changeImg = (direction: boolean) => {
    if(direction === true) {
      if(imgRondell !== mockImages.length - 1) {
        setImgRondell(imgRondell + 1)
      } else {
        setImgRondell(0)
      }
    } else {
      if(imgRondell !== 0) {
        setImgRondell(imgRondell - 1)
      } else {
        setImgRondell(mockImages.length - 1)
      }
    }
  }

  const changeImgSpecific = (number: boolean) => {
    if(number < 0 && number > mockImages.length - 1) return
    setImgRondell(number)
  }

  useEffect(() => {
    const count = mockSizes.length
    setSizeSelector((count - 1) / 2)
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
              mockImages.map((img, i) => (
                <div
                  key={i}
                  css={[
                    tw`transition duration-500`,
                    imgRondell === i ? tw`opacity-100` : tw`opacity-0`
                ]}>
                  <Image src={img.src} layout="fill" objectFit="cover" objectPosition="50% 50%" alt={'Prodcut Image No.' + i} />
                </div>
              ))
            }
          </div>
        </div>
        <div css={tw`grid-area[1/1/2/2] relative`}>
          <div css={tw`absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5 opacity-75 hover:opacity-100 transition duration-300 z-index[+1]`}>
            {
              mockImages.map((_, i) => (
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
            <span css={tw`text-sm font-light`}>Hoodie</span>
            <h1 css={tw`text-3xl font-semibold`}>Product a</h1>
            <span>maybe description</span>
          </div>
          <div css={tw`mt-4`}>
            <span css={tw`text-red-500 line-through text-sm font-light`}>EUR 17,34</span>
            <h2 css={tw`text-xl font-medium`}>EUR 10,00</h2>
          </div>
          <div css={tw`mt-4`}>
            <div css={tw`flex items-center gap-2 flex-wrap`}>
              <div css={tw`flex items-center gap-2 border border-gray-200 w-max rounded-lg p-0.5 text-sm`}>
                {
                  mockSizes.map((s, i) => (
                    <span css={[
                      tw`uppercase rounded-lg px-3 py-1 cursor-pointer transition duration-300`,
                      sizeSelector === i ? tw`bg-gray-200` : tw`hover:(ring ring-inset ring-transparent ring-offset-1 ring-offset-gray-200)`
                    ]} key={i} onClick={() => setSizeSelector(i)}>
                      {s.size}
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
                  <tr css={tw`border-b border-gray-100`}>
                    <th css={tw`text-xs font-normal text-left`}>in cm</th>
                    {
                      mockSizes.map((s, i) => (
                        <th key={i} css={tw`font-normal uppercase text-center`}>
                          {s.size}
                        </th>
                      ))
                    }
                  </tr>
                  <tr css={tw`border-b border-gray-100`}>
                    <td css={tw`font-normal uppercase`}>Chest</td>
                    {
                      mockSizes.map((s, i) => (
                        <td key={i}>{s.chest}</td>
                      ))
                    }
                  </tr>
                  <tr>
                    <td css={tw`font-normal uppercase`}>Waist</td>
                    {
                      mockSizes.map((s, i) => (
                        <td key={i}>{s.waist}</td>
                      ))
                    }
                  </tr>
                </table>
                <span css={tw`block mt-2 text-sm font-light`}>Model trägt Größe M</span>
              </div>
            </Transition>
            <button css={tw`border border-gray-300 bg-gray-50 py-1 px-4 rounded-lg mt-3 flex items-center gap-2 text-lg`}>
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