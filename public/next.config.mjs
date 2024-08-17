/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/media/**',
        },
        {
          protocol: 'https',
          hostname: 'localhost',
          port: '8000',
          pathname: '/media/**',
        },
      ],
    },
  };

export default nextConfig;
