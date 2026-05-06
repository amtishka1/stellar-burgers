import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredientsSlice';
import constructorSlice from './slices/constructorSlice';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import feedSlice from './slices/feedSlice';
import ordersSlice from './slices/ordersSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
