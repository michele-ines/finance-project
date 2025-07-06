/** @type {import('next').NextConfig} */
const nextConfig = {
   trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
