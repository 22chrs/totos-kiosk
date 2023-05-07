const useWebsocket = process.env.WEBSOCKET_SERVICE_ENV === 'useWebsocket';

const locales = useWebsocket
  ? ['de_DE', 'en_US', 'fr_FR', 'ru_RU']
  : ['de_DE', 'en_US'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // config options here
  /*
  experimental: {
    appDir: true, // for Next.js 13 or later if you want to use the new beta app directory
  },
  */

  i18n: {
    locales: locales,
    defaultLocale: 'de_DE',
  },

  env: {
    KIOSK: process.env.KIOSK,
    NEXT_PUBLIC_WEBSOCKET_SERVER_ENV: process.env.WEBSOCKET_SERVER_ENV,
    NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV: process.env.WEBSOCKET_SERVICE_ENV,
  },
};

export default nextConfig;
