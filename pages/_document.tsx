import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'
import { extractCritical } from '@emotion/server'
import { Fragment } from 'react'

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
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument