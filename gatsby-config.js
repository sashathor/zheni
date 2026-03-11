const path = require('path');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

let contentfulConfig;

try {
  // Load the Contentful config from the .contentful.json
  contentfulConfig = require('./.contentful');
} catch (_) {}

// Overwrite the Contentful config with environment variables if they exist
contentfulConfig = {
  spaceId: process.env.GATSBY_CONTENTFUL_SPACE_ID || contentfulConfig.spaceId,
  accessToken:
    process.env.GATSBY_CONTENTFUL_DELIVERY_TOKEN ||
    contentfulConfig.accessToken,
};

const { spaceId, accessToken } = contentfulConfig;

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the delivery token need to be provided.',
  );
}

module.exports = {
  siteMetadata: {
    title: 'Zheni Studio',
    description: 'Handmade ceramics by Zheni. Unique pottery, tableware, and art objects.',
    siteUrl: 'https://zheni.studio',
  },
  pathPrefix: '/zheni',
  plugins: [
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    'gatsby-plugin-sharp',
    'gatsby-plugin-image',
    'gatsby-plugin-theme-ui',
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ['Product'],
        secretKey: process.env.GATSBY_STRIPE_SECRET_KEY,
        downloadFiles: false,
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'roboto:300,300i,400,400i,500,500i,700,700i',
        ],
        display: 'swap',
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: process.env.GATSBY_GOOGLE_ANALYTICS_KEY,
      },
    },
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        src: path.join(__dirname, 'src'),
        components: path.join(__dirname, 'src/components'),
        context: path.join(__dirname, 'src/context'),
        hooks: path.join(__dirname, 'src/hooks'),
        pages: path.join(__dirname, 'src/pages'),
        templates: path.join(__dirname, 'src/templates'),
        utils: path.join(__dirname, 'src/utils'),
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://zheni.studio',
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        excludes: [
          '/cart/',
          '/order-confirmed/',
          '/shop/product/test*',
        ],
      },
    },
  ],
};
