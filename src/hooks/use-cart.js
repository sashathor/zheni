import { useContext } from 'react';
import axios from 'axios';
import ShopContext from '../context/shop-context';
import { fetchAvailableProducts } from './use-available-products';

const useCart = () => {
  // TODO: investigate weird behavior of state during the build
  const { state = { shoppingCart: [] }, dispatch } = useContext(ShopContext);
  const { shoppingCart, availableProducts } = state;

  const addToCart = (payload) => {
    dispatch({ type: 'ADD_TO_CART', payload });
  };

  const removeFromCart = (payload) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isCartContains = (id) => shoppingCart.indexOf(id) > -1;

  const redirectToCheckout = async ({ items, code }) => {
    try {
      const loadStripe = await require('@stripe/stripe-js').loadStripe;
      const stripe = await loadStripe(
        process.env.GATSBY_STRIPE_PUBLISHABLE_KEY,
      );

      await stripe.redirectToCheckout({
        items,
        successUrl: `${window.location.origin}/order-confirmed/`,
        cancelUrl: `${window.location.origin}/order-error`,
        shippingAddressCollection: {
          allowedCountries: [code],
        },
      });
    } catch (e) {
      return Promise.reject(new Error(500));
    }
  };

  const setDelivery = async ({ items, delivery: { price, country, code } }) => {
    let deliverySku;

    try {
      const deliverySkuData = await axios.post('/.netlify/functions/checkout', {
        type: 'zheni.checkout.delivery',
        price,
        country,
        code,
      });
      deliverySku = deliverySkuData.data.response.deliverySku;
    } catch (e) {}

    if (deliverySku) {
      return await redirectToCheckout({
        items: [...items, { sku: deliverySku, quantity: 1 }],
        code,
      });
    }

    return Promise.reject(new Error(500));
  };

  const checkout = async ({
    event,
    items,
    delivery,
    unavailableProductsCallback,
    checkoutAfterCheck,
  }) => {
    event.preventDefault();
    const activeProducts = items.filter(({ active }) => active);
    if (!checkoutAfterCheck) {
      await fetchAvailableProducts({ shoppingCart, dispatch });
      if (items.filter(({ active }) => !active).length > 0) {
        unavailableProductsCallback();
        return;
      }
    }

    return await setDelivery({
      items: activeProducts.map(({ sku, quantity }) => ({
        sku,
        quantity,
      })),
      delivery,
    });
  };

  return {
    state,
    dispatch,
    availableProducts,
    addToCart,
    removeFromCart,
    clearCart,
    checkout,
    isCartContains,
  };
};

export default useCart;
