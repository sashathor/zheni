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
    if (shoppingCart.length > 0) {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const isCartContains = (id) =>
    Array.isArray(shoppingCart) && shoppingCart.indexOf(id) > -1;

  const redirectToCheckout = async ({ sessionId }) => {
    try {
      const loadStripe = await require('@stripe/stripe-js').loadStripe;
      const stripe = await loadStripe(
        process.env.GATSBY_STRIPE_PUBLISHABLE_KEY,
        {
          maxNetworkRetries: process.env.GATSBY_STRIPE_NETWORK_RETRIES,
        },
      );

      const checkoutSettings = {
        sessionId,
      };

      await stripe.redirectToCheckout(checkoutSettings);
    } catch (e) {
      console.log({ e });
      return Promise.reject(new Error(500));
    }
  };

  const createSession = async (order) => {
    let sessionId;

    try {
      const sessionData = await axios.post(
        '/.netlify/functions/create-checkout-session',
        { order },
      );
      sessionId = sessionData.data.response.sessionId;
    } catch (e) {
      console.log({ e });
    }

    if (sessionId) {
      return await redirectToCheckout({ sessionId });
    }

    return Promise.reject(new Error(500));
  };

  const checkout = async ({
    event,
    items,
    delivery,
    discount,
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

    return await createSession({
      items: activeProducts.map(({ id, quantity, price }) => ({
        id,
        quantity,
        price,
      })),
      delivery,
      discount,
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
