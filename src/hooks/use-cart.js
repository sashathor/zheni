import { useContext } from 'react';
import ShopContext from '../context/shop-context';

const useCart = () => {
  // TODO: investigate weird behavior of state during the build
  const { state = { shoppingCart: {} }, dispatch } = useContext(ShopContext);

  const addToCart = (payload) => {
    dispatch({ type: 'ADD_TO_CART', payload });
  };

  const removeFromCart = (payload) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isCartContains = (sku) => state && state.shoppingCart[sku];

  const redirectToCheckout = async (event, items) => {
    event.preventDefault();
    const loadStripe = await require('@stripe/stripe-js').loadStripe;

    const stripe = await loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);

    const { error } = await stripe.redirectToCheckout({
      items,
      successUrl: `${window.location.origin}/order-confirmed/`,
      cancelUrl: `${window.location.origin}/order-error`,
    });
    if (error) {
      console.warn('Error:', error);
    }
  };

  return {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    clearCart,
    redirectToCheckout,
    isCartContains,
  };
};

export default useCart;
