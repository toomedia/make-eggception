/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.eggception.club',
      },
    ],
  },
}

module.exports = nextConfig
