/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: 'pand-back.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'pandaemart.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pandaemart.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/accounts',
        destination: '/account',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/shop',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
