import React, { createContext, useReducer } from 'react';

const shopContextValues = {
  shoppingCart: JSON.parse(localStorage.getItem('shoppingCart')) || {},
};

const shopReducer = (state, { type, payload }) => {
  let shoppingCart;
  switch (type) {
    case 'ADD_TO_CART':
      shoppingCart = { ...state.shoppingCart };
      let product = shoppingCart[payload.sku];
      if (product) {
        product.quantity = product.quantity + 1;
      } else {
        shoppingCart[payload.sku] = payload;
      }
      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
      return { ...state, shoppingCart };
    case 'REMOVE_FROM_CART':
      shoppingCart = { ...state.shoppingCart };
      if (shoppingCart[payload.sku]) {
        delete shoppingCart[payload.sku];
      }
      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
      return { ...state, shoppingCart };
    case 'CLEAR_CART':
      shoppingCart = {};
      localStorage.removeItem('shoppingCart');
      return { ...state, shoppingCart };
    default:
      return shoppingCart;
  }
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
