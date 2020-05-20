import { useContext, useEffect } from 'react';
import axios from 'axios';
import ShopContext from '../context/shop-context';

export const checkProductsAvailability = async (shoppingCart) => {
  try {
    const checkedSkusData = await axios.post('/.netlify/functions/check-sku', {
      skus: shoppingCart.join(','),
    });
    return checkedSkusData.data.response;
  } catch (e) {
    return Promise.reject({ e });
  }
};

export const fetchAvailableProducts = async ({ shoppingCart, dispatch }) => {
  const soldProducts = await checkProductsAvailability(shoppingCart);
  const payload = shoppingCart.filter((id) =>
    soldProducts.find((item) => item.id === id && item.status === 'active'),
  );
  dispatch({
    type: 'SET_AVAILABLE_PRODUCTS',
    payload,
  });
};

const useAvailableProducts = () => {
  const {
    dispatch,
    state = { shoppingCart: [], availableProducts: undefined },
  } = useContext(ShopContext);
  const { shoppingCart, availableProducts } = state;
  useEffect(() => {
    fetchAvailableProducts({ shoppingCart, dispatch });
  }, [shoppingCart, dispatch]);

  return {
    state,
    dispatch,
    availableProducts,
  };
};

export default useAvailableProducts;
