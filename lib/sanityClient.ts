import sanityClient from '@sanity/client'
import urlBuilder from '@sanity/image-url'

const config = {
  projectId: 't5k185jb',
  dataset: 'production',
  apiVersion: 'v1',
  useCdn: true
}

const client = sanityClient(config)

const builder = urlBuilder(config)

const urlFor = (source:any) => {
  return builder.image(source)
}

export { client as default, urlFor }