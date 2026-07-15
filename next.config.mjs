/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/itunes',
        destination: 'https://itunes.apple.com/search',
      },
    ];
  },
};

export default nextConfig;
