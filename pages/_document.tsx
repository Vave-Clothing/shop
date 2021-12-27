import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import { extractCritical } from '@emotion/server'
import { Fragment } from 'react'
import tw from 'twin.macro'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const critical = extractCritical(initialProps.html)
    initialProps.html = critical.html
    initialProps.styles = (
      <Fragment>
        {initialProps.styles}
        <style
          data-emotion-css={critical.ids.join(' ')}
          dangerouslySetInnerHTML={{ __html: critical.css }}
        />
      </Fragment>
    )

    return initialProps
  }

  render() {
    return (
      <Html lang="de-DE">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        </Head>
        <body css={tw`font-body xl:overflow-hidden overflow-y-scroll min-h-screen`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument