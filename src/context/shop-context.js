import React, { createContext, useReducer } from 'react';

const getShoppingCartFromLocalStorage = () =>
  typeof window !== 'undefined'
    ? window.localStorage.getItem('shoppingCart')
    : null;

const shopContextValues = {
  shoppingCart: JSON.parse(getShoppingCartFromLocalStorage()) || [],
  availableProducts: undefined,
};

const shopReducer = (state, { type, payload }) => {
  const { shoppingCart: shoppingCartPrev } = state;
  switch (type) {
    case 'ADD_TO_CART':
      if (shoppingCartPrev.indexOf(payload.id) === -1) {
        const shoppingCart = [...shoppingCartPrev, payload.id];
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        return { ...state, shoppingCart };
      }
      break;
    case 'REMOVE_FROM_CART':
      const itemIdx = shoppingCartPrev.indexOf(payload.id);
      if (itemIdx > -1) {
        const shoppingCart = [...shoppingCartPrev];
        shoppingCart.splice(itemIdx, 1);
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        return { ...state, shoppingCart };
      }
      break;
    case 'CLEAR_CART':
      const shoppingCart = [];
      localStorage.removeItem('shoppingCart');
      return { ...state, shoppingCart };
    case 'SET_AVAILABLE_PRODUCTS':
      return { ...state, availableProducts: payload };
    default:
      return state;
  }
  return state;
};

const ShopContext = createContext(shopReducer);

const ShopContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, shopContextValues);
  return (
    <ShopContext.Provider value={{ state, dispatch }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
export { ShopContextProvider };
