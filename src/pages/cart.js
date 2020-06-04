/** @jsx jsx */

import { Fragment, useState, useCallback } from 'react';
import { graphql } from 'gatsby';
import Image from 'gatsby-image';
import { Link } from 'gatsby';
import {
  Alert,
  Box,
  Button,
  Close,
  Grid,
  Heading,
  Spinner,
  Text,
  Link as ThemeLink,
  jsx,
} from 'theme-ui';
import Layout from '../components/layout';
import Delivery from '../components/delivery';
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
    state: { shoppingCart, availableProducts },
    checkout,
    removeFromCart,
  } = useCart();

  const [delivery, setDelivery] = useState();
  const [checkoutInProcess, setCheckoutInProcess] = useState(false);
  const [checkoutAfterCheck, setCheckoutAfterCheck] = useState(false);
  const [alertMessage, setAlertMessage] = useState();

  const setDeliveryFetching = useCallback(setCheckoutInProcess, []);
  const onChangeDelivery = useCallback(
    (data) => setDelivery(data || undefined),
    [],
  );

  // .filter(({ productContentful }) => productContentful)

  const productsList = products
    .filter(
      ({ id, productContentful }) =>
        productContentful && shoppingCart.indexOf(id) > -1,
    )
    .map((product) => ({
      ...product,
      active: availableProducts?.indexOf(product.id) > -1,
    }));

  const productsListActive = productsList.filter(({ active }) => active);

  const isCheckoutAllowed = () =>
    productsListActive.length > 0 && delivery !== undefined;

  const checkoutCart = async (event) => {
    setCheckoutInProcess(true);
    setAlertMessage(undefined);
    await checkout({
      event,
      delivery,
      items: productsList.map(({ id, active }) => ({
        sku: id,
        active,
        quantity: 1,
      })),
      unavailableProductsCallback: () => {
        setCheckoutAfterCheck(true);
        setCheckoutInProcess(false);
        setAlertMessage(
          `Unfortunately, some of the selected products are not available anymore. ${
            isCheckoutAllowed() ? " Click 'Checkout' to proceed." : ''
          }`,
        );
      },
      checkoutAfterCheck,
    }).catch((e) => {
      setAlertMessage('Something went wrong. Try again in a few minutes.');
      setCheckoutInProcess(false);
    });
  };

  const cost = {
    subtotal: productsListActive.reduce((total, { price }) => total + price, 0),
    getTotal: function () {
      return this.subtotal + delivery?.price;
    },
  };

  return (
    <Layout page={page}>
      <Heading variant="text.pageTitle">Shopping cart</Heading>
      {productsList.length === 0 ? (
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
          {productsList.map(
            ({
              id,
              price,
              active,
              productContentful: { title, slug, images },
            }) => (
              <Grid
                key={id}
                gap={[2, 4, 4]}
                columns={[1, '1fr 3fr 1fr', '1fr 3fr 1fr']}
                sx={{
                  alignItems: 'center',
                  borderBottom: '1px solid #e5e5e5',
                  color: active ? 'inherit' : '#a5a5a5',
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
                    onClick={() => removeFromCart({ id })}
                  />
                  <Link to={`/shop/product/${slug}`}>
                    <Image
                      fluid={images[0].fluid}
                      alt={title}
                      fadeIn
                      className="img"
                      sx={{
                        maxHeight: ['40vh', 'auto', 'auto'],
                        opacity: active ? 1 : 0.4,
                      }}
                    />
                  </Link>
                </Box>
                <Box>
                  <Text>{title}</Text>
                </Box>
                <Box sx={{ textAlign: ['left', 'right', 'right'] }} pr={4}>
                  {availableProducts && (active ? formatPrice(price) : 'Sold')}
                </Box>
                <Box sx={{ display: ['block', 'none', 'none'] }}>
                  <ThemeLink onClick={() => removeFromCart({ id })}>
                    Remove
                  </ThemeLink>
                </Box>
              </Grid>
            ),
          )}
          {productsListActive.length > 0 && (
            <Grid gap={[2, 4, 4]} columns={[1, '3fr 2fr', '3fr 2fr']}>
              <Box mr={[0, '20%', '20%']}>
                <Delivery
                  weight={productsListActive.reduce(
                    (total, { productContentful: { weight } }) =>
                      total + weight,
                    0,
                  )}
                  setFetching={setDeliveryFetching}
                  onChange={onChangeDelivery}
                  disabled={checkoutInProcess}
                />
              </Box>
              <Box pr={[0, 4, 4]} pt={4}>
                <Grid gap={[2, 3, 3]} columns={2}>
                  <Box>
                    <Text variant="text.upperCase">Subtotal</Text>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {formatPrice(cost.subtotal)}
                  </Box>
                  {delivery?.price && (
                    <Fragment>
                      <Box>
                        <Text variant="text.upperCase">Delivery</Text>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        {formatPrice(delivery.price)}
                      </Box>
                      <Box>
                        <Text variant="text.upperCase">Total</Text>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        {formatPrice(cost.getTotal())}
                      </Box>
                    </Fragment>
                  )}
                </Grid>
              </Box>
            </Grid>
          )}
          {alertMessage && (
            <Alert
              variant="primary"
              mt={4}
              mb={4}
              pr={4}
              sx={{ display: 'block', textAlign: 'right' }}
            >
              {alertMessage}
            </Alert>
          )}

          <Box sx={{ textAlign: 'right' }} mt={2}>
            {checkoutInProcess && <Spinner />}
            {!checkoutInProcess && isCheckoutAllowed() && (
              <Button onClick={(event) => checkoutCart(event)}>Checkout</Button>
            )}
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
    allStripeSku(sort: { order: DESC, fields: productContentful___updatedAt }) {
      products: nodes {
        id
        price
        productContentful {
          title
          slug
          weight
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
