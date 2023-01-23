/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: "/universite/:path",
        destination: "/universite/:path/degerlendirmeler",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
