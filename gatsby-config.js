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
  spaceId: process.env.CONTENTFUL_SPACE_ID || contentfulConfig.spaceId,
  accessToken:
    process.env.CONTENTFUL_DELIVERY_TOKEN || contentfulConfig.accessToken,
};

const { spaceId, accessToken } = contentfulConfig;

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the delivery token need to be provided.',
  );
}

module.exports = {
  pathPrefix: '/zheni',
  plugins: [
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    'gatsby-plugin-sharp',
    'gatsby-plugin-theme-ui',
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ['Sku'],
        secretKey: process.env.STRIPE_SECRET_KEY,
        downloadFiles: false,
      },
    },
    {
      resolve: 'gatsby-plugin-prefetch-google-fonts',
      options: {
        fonts: [
          {
            family: 'Roboto',
            subsets: ['latin'],
            variants: [
              '300',
              '300i',
              '400',
              '400i',
              '500',
              '500i',
              '700',
              '700i',
            ],
          },
        ],
      },
    },
    // {
    //   resolve: '@contentful/gatsby-transformer-contentful-richtext',
    //   options: {
    //     renderOptions: {
    //       renderNode: {
    //         [BLOCKS.HEADING_4]: (node, next) => (
    //           <Heading as="h4">{next(node.content)}</Heading>
    //         ),
    //         // [BLOCKS.HEADING_4]: (node, next) => (
    //         //   <Heading as="h4">{next(node.content)}</Heading>
    //         // ),
    //       },
    //     },
    //   },
    // },
  ],
};
