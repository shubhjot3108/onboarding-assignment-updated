import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    filters: filterReducer,
  },
});