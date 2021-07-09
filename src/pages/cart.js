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
import Discount from '../components/discount';
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
    allStripeProduct: { products },
  },
}) => {
  const {
    state: { shoppingCart, availableProducts },
    checkout,
    removeFromCart,
  } = useCart();

  const [delivery, setDelivery] = useState();
  const [discount, setDiscount] = useState();
  const [checkoutInProcess, setCheckoutInProcess] = useState(false);
  const [checkoutAfterCheck, setCheckoutAfterCheck] = useState(false);
  const [alertMessage, setAlertMessage] = useState();

  const setDeliveryFetching = useCallback(setCheckoutInProcess, [
    setCheckoutInProcess,
  ]);
  const onChangeDelivery = useCallback(
    (data) => setDelivery(data || undefined),
    [],
  );

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
    productsListActive.length > 0 && delivery?.price;

  const checkoutCart = async (event) => {
    setCheckoutInProcess(true);
    setAlertMessage(undefined);
    await checkout({
      event,
      delivery,
      discount,
      items: productsList.map(({ id, active, productContentful }) => ({
        id,
        price: productContentful.price,
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

  const getDelivery = () => (discount?.free_delivery ? 0 : delivery?.price);
  const getSubtotal = () =>
    productsListActive.reduce(
      (total, { productContentful: { price } }) => total + price,
      0,
    );
  const getDiscount = () =>
    discount?.discount ? getSubtotal() * (discount.discount / 100) : 0;
  const getTotal = () => getSubtotal() - getDiscount() + getDelivery();

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
            <Box pl={[0, 4]}>
              <Text variant="text.upperCase">Item</Text>
            </Box>
            <Box sx={{ textAlign: 'right' }} pr={[0, 4]}>
              <Text variant="text.upperCase">Price</Text>
            </Box>
          </Grid>
          {productsList.map(
            ({
              id,
              active,
              productContentful: { title, slug, images, price },
            }) => (
              <Grid
                key={id}
                gap={[2, 4]}
                columns={[1, '1fr 3fr 1fr']}
                sx={{
                  alignItems: 'center',
                  borderBottom: '1px solid #e5e5e5',
                  color: active ? 'inherit' : '#a5a5a5',
                }}
                mt={4}
                pb={4}
                mb={4}
              >
                <Box pl={[0, 4]} mb={[3, 0]} sx={{ position: 'relative' }}>
                  <RemoveButton
                    sx={{ display: ['none', 'block'] }}
                    onClick={() => removeFromCart({ id })}
                  />
                  <Link to={`/shop/product/${slug}`}>
                    <Image
                      fluid={images[0].fluid}
                      alt={title}
                      fadeIn
                      className="img"
                      sx={{
                        maxHeight: ['40vh', 'auto'],
                        opacity: active ? 1 : 0.4,
                      }}
                    />
                  </Link>
                </Box>
                <Box>
                  <Text>{title}</Text>
                </Box>
                <Box sx={{ textAlign: ['left', 'right'] }} pr={4}>
                  {availableProducts && (active ? formatPrice(price) : 'Sold')}
                </Box>
                <Box sx={{ display: ['block', 'none'] }}>
                  <ThemeLink onClick={() => removeFromCart({ id })}>
                    Remove
                  </ThemeLink>
                </Box>
              </Grid>
            ),
          )}
          {productsListActive.length > 0 && (
            <Grid gap={[2, 4]} columns={[1, '3fr 2fr']}>
              <Box p={4} sx={{ border: '1px solid #e5e5e5' }} mr={[0, '20%']}>
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
                <Box mt={4}>
                  <Discount onCheck={setDiscount} />
                  {discount === null && (
                    <Box mt={1}>
                      <Text variant="text.upperCase" color="#c0c0c0">
                        Discount code is not valid
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box pr={[0, 4]} pt={4}>
                <Grid gap={[2, 3]} columns={2}>
                  <Box>
                    <Text variant="text.upperCase">Subtotal</Text>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {formatPrice(getSubtotal())}
                  </Box>
                  {discount && (
                    <Fragment>
                      <Box>
                        <Text variant="text.upperCase">Discount</Text>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        {`- ${formatPrice(getDiscount())}`}
                      </Box>
                    </Fragment>
                  )}
                  {(delivery?.price || discount?.free_delivery) && (
                    <Fragment>
                      <Box>
                        <Text variant="text.upperCase">Delivery</Text>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        {getDelivery() ? formatPrice(delivery.price) : 'FREE'}
                      </Box>
                      <Box>
                        <Text variant="text.upperCase">Total</Text>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        {formatPrice(getTotal())}
                      </Box>
                    </Fragment>
                  )}
                </Grid>
                <Box sx={{ textAlign: 'right' }} mt={4}>
                  {checkoutInProcess && <Spinner />}
                  {!checkoutInProcess && isCheckoutAllowed() && (
                    <Button onClick={(event) => checkoutCart(event)}>
                      Checkout
                    </Button>
                  )}
                </Box>
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
    allStripeProduct(
      sort: { order: DESC, fields: productContentful___updatedAt }
    ) {
      products: nodes {
        id
        productContentful {
          title
          slug
          weight
          price
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
