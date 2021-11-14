import type { NextPage } from 'next'
import tw from 'twin.macro'
import Image from 'next/image'

import IMG1 from '@/assets/pexels-bryants-juarez-10154526.jpg'
import IMG2 from '@/assets/pexels-bryants-juarez-10154573.jpg'
import IMG3 from '@/assets/pexels-bryants-juarez-10154575.jpg'

const Product: NextPage = () => {
  return (
    <div css={tw`grid md:grid-template-columns[3fr 2fr] gap-4`}>
      <div css={tw`flex flex-col items-center`}>
        <div css={tw`width[50rem] height[50rem] relative rounded-xl overflow-hidden`}>
          <Image src={IMG1} layout="fill" objectFit="cover" objectPosition="50% 50%" />
        </div>
      </div>
      <div>b</div>
    </div>
  )
}

export default Product