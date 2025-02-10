/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC minifier due to installation issues
  swcMinify: false,

  // Other Next.js config options can go here
  reactStrictMode: true,
};

module.exports = nextConfig;
