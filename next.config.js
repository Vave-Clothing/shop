/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "script-src 'unsafe-inline' 'self' 'unsafe-eval' https://js.stripe.com/ https://www.paypal.com/"
  }
]

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withTM = require('next-transpile-modules')(['@simplewebauthn/browser'])

module.exports = withBundleAnalyzer(withTM({
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [ 'cdn.sanity.io', 'x.klarnacdn.net' ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  cleanupIDs: false,
                  prefixIds: false
                }
              ]
            }
          }
        }
      ]
    });

    return config;
  }
}))
