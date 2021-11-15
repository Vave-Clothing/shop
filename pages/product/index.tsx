import type { NextPage } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'
import { v4 as randUUID } from 'uuid'
import { useState } from 'react'
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi'

import IMG1 from '@/assets/pexels-bryants-juarez-10154526.jpg'
import IMG2 from '@/assets/pexels-bryants-juarez-10154573.jpg'
import IMG3 from '@/assets/pexels-bryants-juarez-10154575.jpg'

const mockImages = [
  { uuid: randUUID(), src: IMG1 },
  { uuid: randUUID(), src: IMG2 },
  { uuid: randUUID(), src: IMG3 },
]

const Product: NextPage = () => {
  const [imgRondell, setImgRondell] = useState(0)

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

  const changeImgSpecific = (number: number) => {
    if(number < 0 && number > mockImages.length - 1) return
    setImgRondell(number)
  }

  return (
    <div css={tw`grid md:grid-template-columns[3fr 2fr] gap-4`}>
      <div css={tw`grid`} className="group">
        <div css={tw`flex flex-col items-center grid-area[1/1/2/2]`}>
          <div css={tw`width[50rem] height[50rem] relative rounded-xl overflow-hidden`}>
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
          <div css={tw`absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-200`}>
            <div css={tw`text-xl bg-black bg-opacity-25 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(false)}>
              <HiOutlineArrowLeft />
            </div>
            <div css={tw`text-xl bg-black bg-opacity-25 py-4 px-2 rounded cursor-pointer`} onClick={() => changeImg(true)}>
              <HiOutlineArrowRight />
            </div>
          </div>
          <div css={tw`absolute bottom-1 left-0 right-0 flex items-center justify-center gap-1.5 opacity-75 hover:opacity-100 transition duration-300`}>
            {
              mockImages.map((_, i) => (
                <div css={[
                  tw`w-5 h-5 ring-4 ring-white ring-inset rounded-full transition duration-300 cursor-pointer`,
                  i === imgRondell ? tw`bg-black` : tw`bg-white`
                ]} onClick={() => changeImgSpecific(i)} key={i}></div>
              ))
            }
          </div>
        </div>
      </div>
      <div>
        <span>{imgRondell}</span>
      </div>
    </div>
  )
}

export default Product