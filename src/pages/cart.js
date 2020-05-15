/** @jsx jsx */

import { Fragment } from 'react';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Link } from 'gatsby';
import {
  Box,
  Button,
  Flex,
  Close,
  Grid,
  Heading,
  Text,
  Link as ThemeLink,
  jsx,
} from 'theme-ui';
import Layout from '../components/layout';
import useCart from '../hooks/use-cart';
import formatPrice from '../utils/format-price';

const RemoveButton = ({ onClick }) => (
  <Close
    onClick={onClick}
    sx={{
      position: 'absolute',
      width: 24,
      height: 24,
      padding: 0,
      cursor: 'pointer',
      left: 0,
      color: 'primary',
      top: '50%',
      transform: 'translateY(-50%)',
    }}
  />
);

const CartPage = ({
  data: {
    page,
    allStripeSku: { products },
  },
}) => {
  const {
    state: { shoppingCart },
    redirectToCheckout,
    removeFromCart,
  } = useCart();

  const availableProducts = products.filter(
    (product) => shoppingCart[product.id],
  );

  return (
    <Layout page={page}>
      <Heading variant="text.pageTitle">Shopping cart</Heading>
      {availableProducts.length === 0 ? (
        <Box
          sx={{
            borderTop: '1px solid #e5e5e5',
            borderBottom: '1px solid #e5e5e5',
            textAlign: 'center',
          }}
          mt={4}
          pt={5}
          pb={5}
        >
          <Text variant="text.upperCase">Emptiness</Text>
        </Box>
      ) : (
        <Fragment>
          <Grid
            gap={2}
            columns={[2]}
            sx={{ borderBottom: '1px solid #e5e5e5' }}
            pb={2}
            mb={2}
          >
            <Box pl={[0, 4, 4]}>
              <Text variant="text.upperCase">Item</Text>
            </Box>
            <Box sx={{ textAlign: 'right' }} pr={[0, 4, 4]}>
              <Text variant="text.upperCase">Price</Text>
            </Box>
          </Grid>
          {availableProducts.map(
            ({
              id,
              currency,
              price,
              productContentful: { title, slug, images },
            }) => (
              <Grid
                key={id}
                gap={[2, 4, 4]}
                columns={[1, '1fr 3fr 1fr', '1fr 3fr 1fr']}
                sx={{
                  alignItems: 'center',
                  borderBottom: '1px solid #e5e5e5',
                }}
                mt={4}
                pb={4}
                mb={4}
              >
                <Box
                  pl={[0, 4, 4]}
                  mb={[3, 0, 0]}
                  sx={{ position: 'relative' }}
                >
                  <RemoveButton
                    sx={{ display: ['none', 'block', 'block'] }}
                    onClick={() => removeFromCart({ sku: id })}
                  />
                  <Link to={`/shop/product/${slug}`}>
                    <Image
                      fluid={images[0].fluid}
                      alt={title}
                      fadeIn
                      className="img"
                      sx={{ maxHeight: ['40vh', 'auto', 'auto'] }}
                    />
                  </Link>
                </Box>
                <Box>
                  <Text>{title}</Text>
                </Box>
                <Box sx={{ textAlign: ['left', 'right', 'right'] }} pr={4}>
                  {formatPrice(price, currency)}
                </Box>
                <Box sx={{ display: ['block', 'none', 'none'] }}>
                  <ThemeLink onClick={() => removeFromCart({ sku: id })}>
                    Remove
                  </ThemeLink>
                </Box>
              </Grid>
            ),
          )}
          <Flex
            sx={{ textAlign: 'right', justifyContent: 'flex-end' }}
            pr={[0, 4, 4]}
          >
            <Text variant="text.upperCase" mr={4}>
              Subtotal
            </Text>
            <Text>
              {availableProducts.length > 0 &&
                formatPrice(
                  availableProducts.reduce(
                    (total, { price }) => total + price,
                    0,
                  ),
                  availableProducts[0].currency,
                )}
            </Text>
          </Flex>
          <Box sx={{ textAlign: 'right' }} pr={[0, 4, 4]} mt={4}>
            <Button
              onClick={(event) =>
                redirectToCheckout(
                  event,
                  availableProducts.map(({ id }) => ({ sku: id, quantity: 1 })),
                )
              }
            >
              Checkout
            </Button>
          </Box>
        </Fragment>
      )}
    </Layout>
  );
};

export default CartPage;

export const pageQuery = graphql`
  query($slug: String) {
    page: contentfulPage(slug: { eq: $slug }) {
      ...PageData
    }
    allStripeSku {
      products: nodes {
        id
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
