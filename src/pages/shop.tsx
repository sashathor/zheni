/** @jsx jsx */

import { Fragment } from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { AspectRatio, Heading, Box, Grid, jsx } from 'theme-ui';
import { PageData, Product } from 'types';
import { Layout } from 'components';
import { formatPrice, jsonToHTML } from 'utils';

const ProductLink = styled(Link)`
  text-decoration: none;

  .details {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.2);
    width: auto;
    height: auto;
    margin: 16px;
    padding: 16px;
    color: #ffffff;
    text-transform: uppercase;

    span {
      padding-top: 0;
      display: block;
    }
  }

  &:hover {
    .details {
      &:before {
        background-color: #ff0000;
        z-index: -10;
        content: none;
      }
    }
  }

  @media (min-width: 640px) {
    .details {
      padding: 1rem;
      display: none;

      span {
        display: block;
        padding-top: 45%;
      }
    }

    &:hover {
      .details {
        display: block;
        display: inline-block;
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;

        &:before {
          position: absolute;
          content: '';
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.2);
          z-index: -1;
          top: 0;
          left: 0;
        }
      }
    }
  }
`;

interface ShopPageProps {
  data: {
    page: PageData;
  };
  allStripeProduct: { products: Product[] };
}

const ShopPage: React.FC<ShopPageProps> = ({
  data: {
    page,
    page: { content },
    allContentfulCategory: { categories },
    allStripeProduct: { productCategories },
  },
}) => (
  <Layout page={page}>
    {content && (
      <Box pb={[0, 2]} sx={{ textAlign: 'left' }}>
        {jsonToHTML(content.json)}
      </Box>
    )}
    <Box>
      {categories
        .filter((category) =>
          productCategories.find(
            (productCategory) => productCategory.fieldValue === category.id,
          ),
        )
        .map((category) => (
          <Box key={category.id} mb={[4, 5]}>
            <Heading variant="text.shopCategory" mb={3}>
              {category.title}
            </Heading>
            <Grid gap={[3, 4]} columns={[2, 3]} mt={2}>
              {productCategories
                .find(
                  (productCategory) =>
                    productCategory.fieldValue === category.id,
                )
                ?.products.filter(
                  ({ productContentful }) =>
                    productContentful &&
                    productContentful.status !== 'DirectLink',
                )
                .map(
                  ({
                    id,
                    active,
                    productContentful: { title, slug, images, price, status },
                  }) => (
                    <AspectRatio key={id} ratio={3 / 4}>
                      <ProductLink to={`/shop/product/${slug}`}>
                        <div style={{ position: 'relative', height: '100%' }}>
                          <GatsbyImage
                            image={images[0].gatsbyImageData}
                            alt={images[0].title || title}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          />
                          <div className="details" style={{ position: 'relative', zIndex: 1 }}>
                            <span title={title}>{title}</span>
                            {status === 'OnRequest' && <p>Price on request</p>}
                            {status !== 'OnRequest' && (
                              <Fragment>
                                <p>{formatPrice(price)}</p>
                                {!active && status !== 'PreOrder' && (
                                  <p>SOLD</p>
                                )}
                                {status === 'PreOrder' && <p>PRE-ORDER</p>}
                              </Fragment>
                            )}
                          </div>
                        </div>
                      </ProductLink>
                    </AspectRatio>
                  ),
                )}
            </Grid>
          </Box>
        ))}
    </Box>
  </Layout>
);

export default ShopPage;

export const pageQuery = graphql`
  query($slug: String) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    allContentfulCategory(sort: { updatedAt: DESC }) {
      categories: nodes {
        title
        id
      }
    }
    allStripeProduct(
      sort: { productContentful: { updatedAt: DESC } }
    ) {
      productCategories: group(field: { productContentful: { category: { id: SELECT } } }) {
        fieldValue
        products: nodes {
          id
          active
          productContentful {
            status
            title
            slug
            price
            images {
              title
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, formats: [AUTO, WEBP])
            }
          }
        }
      }
    }
  }
`;
