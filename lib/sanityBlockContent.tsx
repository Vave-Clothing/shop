import tw from 'twin.macro'
import BlockContent from '@sanity/block-content-to-react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanityClient'

const serializers = (props: any) => {
  const { style = 'normal' } = props.node

  if(/^h\d$/.test(style)) {
    switch (Number(style.replace(/[^\d]/g, ''))) {
      case 1:
        return (
          <h1 css={tw`text-4xl font-semibold mt-6 mb-4`}>
            {props.children}
          </h1>
        )
      case 2:
        return (
          <h2 css={tw`text-3xl font-semibold mt-6 mb-4`}>
            {props.children}
          </h2>
        )
      case 3:
        return (
          <h3 css={tw`text-2xl font-semibold mt-6 mb-4`}>
            {props.children}
          </h3>
        )
      case 4:
        return (
          <h4 css={tw`text-xl font-semibold mt-6 mb-3`}>
            {props.children}
          </h4>
        )
    }
  }

  if(style === 'blockquote') {
    return (
      <blockquote css={tw`border-l-2 border-gray-500 pl-2 mb-3`}>
        {props.children}
      </blockquote>
    )
  }

  if(style === 'normal') {
    return (
      <p css={tw`mb-3`}>
        {props.children}
      </p>
    )
  }

  return BlockContent.defaultSerializers.types.block(props)
}

const linkSerializer = (props: any) => {
  return (
    <a href={props.mark.href} rel="noopener noreferrer" target="_blank" css={tw`transition border-b-2 border-dotted border-primary-400 hover:border-primary-300`}>
      {props.children}
    </a>
  )
}

const codeSerializer = (props: any) => {
  return (
    <code css={tw`font-mono bg-gray-100 rounded px-1`}>
      {props.children}
    </code>
  )
}

const listSerializer = (props: any) => {
  const type = props.type
  
  if(type === 'bullet') {
    return (
      <ul css={tw`list-disc ml-8 mb-3`}>
        {props.children}
      </ul>
    )
  }

  if(type === 'number') {
    return (
      <ol css={tw`list-decimal ml-8 mb-3`}>
        {props.children}
      </ol>
    )
  }
}

const listItemSerializer = (props: any) => {
  return (
    <li css={tw`pl-1`}>
      {props.children}
    </li>
  )
}

const imageSerializer = (props: any) => {
  return (
    <div css={tw`mb-4 mt-2 shadow-md`}>
      <Image src={urlFor(props.node.asset).width(1920).height(1080).url()} width={1920} height={1080} layout="responsive" css={tw`rounded`} alt="Image" />
    </div>
  )
}

const serializersProps = {
  types: { block: serializers, image: imageSerializer },
  marks: { link: linkSerializer, code: codeSerializer },
  list: listSerializer,
  listItem: listItemSerializer
}

export { serializersProps as default, serializers, linkSerializer, codeSerializer, listSerializer, listItemSerializer, imageSerializer }