import nextPWA from 'next-pwa';
import { join } from 'path';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev mode
  runtimeCaching: [
    {
      urlPattern:
        /^https:\/\/your-cdn-url\.com\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 200, // Maximum number of images to cache
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        },
      },
    },
    {
      urlPattern: /.*\.(?:jpg|jpeg|png|mov|avi)$/, // Cache local image and video assets
      handler: 'CacheFirst',
      options: {
        cacheName: 'media-assets',
        expiration: {
          maxEntries: 100, // Maximum number of media files to cache
          maxAgeSeconds: 60 * 24 * 60 * 60, // Cache for 60 days
        },
      },
    },
  ],
});

const isProduction = process.env.NODE_ENV === 'production';

// Set locales based on the environment
const locales = isProduction
  ? [
      'de_DE',
      'en_US',
      'fr_FR',
      'ru_RU',
      'es_ES',
      'it_IT',
      'nl_NL',
      'pl_PL',
      'uk_UA',
    ]
  : ['de_DE', 'en_US'];

export default withPWA({
  images: {
    unoptimized: false, // Enable image optimization
  },
  i18n: {
    locales: locales,
    defaultLocale: 'de_DE',
  },
  env: {
    NEXT_PUBLIC_DISABLE_RIGHT_CLICK:
      process.env.NEXT_PUBLIC_DISABLE_RIGHT_CLICK,
    NEXT_PUBLIC_ENVIRONMENT_MODE: process.env.NEXT_PUBLIC_ENVIRONMENT_MODE,
  },

  async headers() {
    return [
      {
        source: '/:img*.(jpg|jpeg|png|mov|avi)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  webpack(config, { isServer }) {
    // To handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
});
