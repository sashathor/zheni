import React, { Dispatch, createContext, useReducer } from 'react';
import { ShoppingCart, Store, Action } from 'types';

const getShoppingCartFromLocalStorage = (): string | null =>
  typeof window !== 'undefined'
    ? window.localStorage.getItem('shoppingCart')
    : null;

const shopContextValues: Store = {
  shoppingCart: JSON.parse(getShoppingCartFromLocalStorage() ?? '[]') || [],
  availableProducts: undefined,
};

type Context = {
  dispatch: React.Dispatch<Action>;
  state: Store;
};

const shopReducer = (state: Store, { type, payload }: Action) => {
  const { shoppingCart: shoppingCartPrev } = state;
  switch (type) {
    case 'ADD_TO_CART':
      if (payload.id && shoppingCartPrev.indexOf(payload.id) === -1) {
        const shoppingCart: ShoppingCart = [...shoppingCartPrev, payload.id];
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        return { ...state, shoppingCart };
      }
      break;
    case 'REMOVE_FROM_CART':
      const itemIdx = shoppingCartPrev.indexOf(payload.id);
      if (itemIdx > -1) {
        const shoppingCart: ShoppingCart = [...shoppingCartPrev];
        shoppingCart.splice(itemIdx, 1);
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        return { ...state, shoppingCart };
      }
      break;
    case 'CLEAR_CART':
      const shoppingCart: ShoppingCart = [];
      localStorage.removeItem('shoppingCart');
      return { ...state, shoppingCart };
    case 'SET_AVAILABLE_PRODUCTS':
      return { ...state, availableProducts: payload as string[] };
    default:
      return state;
  }
  return state;
};

const ShopContext = createContext<{
  state: Store;
  dispatch: Dispatch<Action>;
}>({
  state: shopContextValues,
  dispatch: () => null,
});

const ShopContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, shopContextValues);
  return (
    <ShopContext.Provider value={{ state, dispatch }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
export { ShopContextProvider };
