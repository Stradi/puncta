/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // TODO: Removing this causes errors. I don't know why.
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
