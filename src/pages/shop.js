/** @jsx jsx */

import { graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { AspectRatio, Box, Grid, jsx } from 'theme-ui';

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

const ShopPage = ({
  data: {
    page,
    page: {
      content: { json },
    },
    allStripeSku: { products },
  },
}) => (
  <Layout page={page}>
    <Box pb={[0, 4, 4]} sx={{ textAlign: ['center', 'left', 'left'] }}>
      {jsonToHTML(json)}
    </Box>
    <Grid gap={[3, 4, 4]} columns={[2, 3, 3]}>
      {products.map(
        ({
          currency,
          price,
          productContentful: { id, title, slug, images },
        }) => (
          <AspectRatio key={id} ratio={3 / 4}>
            <ProductLink to={`/shop/product/${slug}`}>
              <BackgroundImage
                fluid={images[0].fluid}
                Tag="section"
                fadeIn="soft"
                sx={{ height: '100%' }}
              >
                <div className="details">
                  <span>{title}</span>
                  {formatPrice(price, currency)}
                </div>
              </BackgroundImage>
            </ProductLink>
          </AspectRatio>
        ),
      )}
    </Grid>
  </Layout>
);

export default ShopPage;

export const pageQuery = graphql`
  query($slug: String) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    allStripeSku {
      products: nodes {
        currency
        price
        productContentful {
          id
          title
          slug
          images {
            fluid {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
