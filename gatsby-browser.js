import React from 'react';

import { ShopContextProvider } from './src/context/shop-context';

export const wrapRootElement = ({ element }) => (
  <ShopContextProvider>{element}</ShopContextProvider>
);
