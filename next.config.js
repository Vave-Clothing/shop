/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "script-src 'unsafe-inline' 'self' 'unsafe-eval' https://js.stripe.com/"
  }
]

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [ 'cdn.sanity.io' ]
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
}
