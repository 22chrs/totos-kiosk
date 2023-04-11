// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://hejtoto.com', // Your website URL
  generateRobotsTxt: true, // Generate robots.txt
  exclude: ['/404'], // Exclude specific pages from the s
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    additionalSitemaps: [],
  },
  // ...other options
};
