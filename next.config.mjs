import createMDX from '@next/mdx'
import mdxOptions from './mdxOptions.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  webpack: (config) => {
    config.module.rules.push({
      test: /(\.ya?ml$)|\.publicodes/,
      use: 'yaml-loader',
    })

    config.module.rules.push({
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    })

    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    })

    return config
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'DELETE, GET, PATCH, POST, PUT, OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization, X-Api-Version',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [{ source: '/feed.xml', destination: '/_next/static/feed.xml' }]
  },

  async redirects() {
    return [{ source: '/guide', destination: '/guide.html', permanent: false }]
  },

  output: 'standalone',

  outputFileTracingIncludes: {
    '/*': [
      './articles/*.mdx',
      './data/copro.min.ndjson',
      './data/copro_tiles/**',
      './data/copro_tiles/meta.json',
    ],
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'commons.wikimedia.org' }],
  },
}

const withMDX = createMDX({ options: mdxOptions })
export default withMDX(nextConfig)
