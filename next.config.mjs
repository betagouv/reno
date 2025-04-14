import createMDX from '@next/mdx'
import mdxOptions from './mdxOptions.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* not sure if needed
		experimental: {
		serverComponentsExternalPackages: ['publicodes'],
		*/
  compiler: {
    styledComponents: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, options) => {
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
    return config
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'DELETE, GET, PATCH, POST, PUT, OPTIONS',
          },
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
    return [
      // Basic redirect
      {
        source: '/guide',
        destination: '/guide.html',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'DELETE, GET, PATCH, POST, PUT, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization, X-Api-Version',
          },
        ],
      },
    ]
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
      },
    ],
  },
}

const withMDX = createMDX({ options: mdxOptions })

const finalConfig = withMDX(nextConfig)

export default finalConfig
