import { useContext, useEffect } from 'react';
import axios from 'axios';
import ShopContext from '../context/shop-context';

const dispatchAvailableProducts = (payload) => ({
  type: 'SET_AVAILABLE_PRODUCTS',
  payload,
});

export const checkProductsAvailability = async (shoppingCart) => {
  try {
    const checkedProductsData = await axios.post(
      '/.netlify/functions/check-products',
      {
        ids: shoppingCart.join(','),
      },
    );
    return checkedProductsData.data.response;
  } catch (e) {
    return Promise.reject({ e });
  }
};

export const fetchAvailableProducts = async ({ shoppingCart, dispatch }) => {
  const soldProducts = await checkProductsAvailability(shoppingCart);
  const payload = shoppingCart.filter((id) =>
    soldProducts.find((item) => item.id === id && item.status === 'active'),
  );
  dispatch(dispatchAvailableProducts(payload));
};

const useAvailableProducts = () => {
  const {
    dispatch,
    state = { shoppingCart: [], availableProducts: undefined },
  } = useContext(ShopContext);
  const { shoppingCart, availableProducts } = state;
  useEffect(() => {
    if (shoppingCart.length > 0) {
      fetchAvailableProducts({ shoppingCart, dispatch });
    } else {
      dispatch(dispatchAvailableProducts([]));
    }
  }, [shoppingCart, dispatch]);

  return {
    state,
    dispatch,
    availableProducts,
  };
};

export default useAvailableProducts;
