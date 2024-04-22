// const isProduction = process.env.NODE_ENV === 'production';

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

const nextConfig = {
  // Properly enable or disable image optimization
  images: {
    unoptimized: true, // Change this to false to enable optimization
    // deviceSizes: [640, 768, 1024, 1280],
    // imageSizes: [16, 32, 48, 64, 96],
    // formats: ['image/avif', 'image/webp'],
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
        source: '/:img*.(jpg|jpeg|png|mov|avi)', // Adjusted to match file types
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

    return config; // Always return the modified config
  },
};

export default nextConfig;
