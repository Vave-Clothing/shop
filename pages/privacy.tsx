import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next'
import tw from 'twin.macro'
import client from '@/lib/sanityClient'
import BlockContent from '@sanity/block-content-to-react'
import serializers from '@/lib/sanityBlockContent'

const TermsOfService: NextPage = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <h1 css={tw`text-4xl font-semibold mt-6 mb-1`}>
        Datenschutzerklärung
      </h1>
      <p css={tw`mb-4 text-gray-500`}>
        Zuletzt bearbeitet:&nbsp;
        {new Date(data._updatedAt).toLocaleDateString('de-DE')}
      </p>
      <BlockContent
        blocks={data.privacy}
        serializers={{...serializers}}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await client.fetch(`
    *[_id == "privacy"]{
      _updatedAt,
      privacy
    }
  `)

  return {
    props: {
      data: data[0]
    },
    revalidate: 60 * 60 * 6
  }
}

export default TermsOfService