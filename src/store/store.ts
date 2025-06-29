import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import balanceReducer from './slices/balanceSlice';
export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    balance: balanceReducer
  },
});
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;