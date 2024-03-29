const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;
  const slug = page.path.replace(/\//g, '') || 'home';
  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      slug,
    },
  });
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allContentfulProduct {
              nodes {
                slug
              }
            }
            allContentfulProject {
              nodes {
                slug
              }
            }
            allContentfulPage {
              nodes {
                slug
              }
            }
          }
        `,
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const productTemplate = path.resolve('./src/templates/product.tsx');
        const products = result.data.allContentfulProduct.nodes;
        products.forEach(({ slug }) => {
          createPage({
            path: `/shop/product/${slug}/`,
            component: productTemplate,
            context: {
              slug,
            },
          });
        });

        const projectTemplate = path.resolve('./src/templates/project.tsx');
        const projects = result.data.allContentfulProject.nodes;
        projects.forEach(({ slug }) => {
          createPage({
            path: `/projects/${slug}/`,
            component: projectTemplate,
            context: {
              slug,
            },
          });
        });

        const genericPageTemplate = path.resolve(
          './src/templates/generic-page.tsx',
        );
        const pages = result.data.allContentfulPage.nodes;
        pages.forEach(({ slug }) => {
          if (!fs.existsSync(`./src/pages/${slug}.tsx`) && slug !== 'home') {
            createPage({
              path: `/${slug}/`,
              component: genericPageTemplate,
              context: {
                slug,
              },
            });
          }
        });
      }),
    );
  });
};

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type StripeProduct implements Node {
      productContentful: ContentfulProduct @link(by: "contentful_id", from: "id")
    }

    type ContentfulProduct implements Node {
      stripeProduct: StripeProduct @link(by: "id", from: "contentful_id")
    }
  `);
};
