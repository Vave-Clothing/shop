/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [ 'cdn.sanity.io' ]
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
