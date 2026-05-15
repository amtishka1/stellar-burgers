import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface OrdersState {
  orders: TOrder[];
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0] || null;
  }
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
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileOrdersLoading: (state) => state.loading,
    getProfileOrdersError: (state) => state.error,
    getCurrentOrder: (state) => state.currentOrder
  }
});

export const {
  getProfileOrders,
  getProfileOrdersLoading,
  getProfileOrdersError,
  getCurrentOrder
} = ordersSlice.selectors;

export default ordersSlice;
