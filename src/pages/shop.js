/** @jsx jsx */

import { Fragment } from 'react';
import { graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { AspectRatio, Heading, Box, Grid, jsx } from 'theme-ui';

import Layout from '../components/layout';
import formatPrice from '../utils/format-price';
import jsonToHTML from '../utils/json-to-html';

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
      /* white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; */
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
        /* white-space: normal;
        overflow: visible;
        text-overflow: initial; */
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

const ShopPage = ({
  data: {
    page,
    page: {
      content: { json },
    },
    allContentfulCategory: { categories },
    allStripeProduct: { productCategories },
  },
}) => (
  <Layout page={page}>
    <Box pb={[0, 2]} sx={{ textAlign: 'left' }}>
      {jsonToHTML(json)}
    </Box>
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
                        <BackgroundImage
                          fluid={images[0].fluid}
                          Tag="section"
                          fadeIn="soft"
                          sx={{ height: '100%' }}
                          alt={images[0].title}
                        >
                          <div className="details">
                            <span title={title}>{title}</span>
                            {status === 'OnRequest' ? (
                              <p>Price on request</p>
                            ) : (
                              <Fragment>
                                <p>{formatPrice(price)}</p>
                                {!active && <p>SOLD</p>}
                              </Fragment>
                            )}
                          </div>
                        </BackgroundImage>
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
    allContentfulCategory(sort: { fields: updatedAt, order: DESC }) {
      categories: nodes {
        title
        id
      }
    }
    allStripeProduct(
      sort: { order: DESC, fields: productContentful___updatedAt }
    ) {
      productCategories: group(field: productContentful___category___id) {
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
              fluid {
                ...GatsbyContentfulFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`;
