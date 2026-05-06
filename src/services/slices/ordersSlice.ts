import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  },
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileOrdersLoading: (state) => state.loading,
    getProfileOrdersError: (state) => state.error
  }
});

export const {
  getProfileOrders,
  getProfileOrdersLoading,
  getProfileOrdersError
} = ordersSlice.selectors;

export default ordersSlice;
