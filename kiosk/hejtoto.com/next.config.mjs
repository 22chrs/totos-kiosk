/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here
  experimental: {
    appDir: true, // for Next.js 13 or later if you want to use the new beta app directory
  },
  */

  i18n: {
    locales: ['de_DE', 'en_US'],
    defaultLocale: 'de_DE',
  },
};

export default nextConfig;
