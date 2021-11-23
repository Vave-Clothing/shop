import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import tw from 'twin.macro'
import client from '@/lib/sanityClient'
import BlockContent from '@sanity/block-content-to-react'
import serializers from '@/lib/sanityBlockContent'
import moment from 'moment-timezone'

const TermsOfService: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <h1 css={tw`text-4xl font-semibold mt-6 mb-1`}>
        Allgemeine Geschäftsbedingungen
      </h1>
      <p css={tw`mb-4 text-gray-500`}>
        Zuletzt bearbeitet:&nbsp;
        {moment(data._updatedAt).format('DD.MM.YYYY')}
      </p>
      <BlockContent
        blocks={data.terms}
        serializers={{...serializers}}
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await client.fetch(`
    *[_id == "tos"]{
      _updatedAt,
      terms
    }
  `)

  return {
    props: {
      data: data[0]
    }
  }
}

export default TermsOfService