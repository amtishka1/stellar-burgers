import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedTotal: (state) => state.total,
    getFeedTotalToday: (state) => state.totalToday,
    getFeedLoading: (state) => state.loading,
    getFeedError: (state) => state.error
  }
});

export const {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedLoading,
  getFeedError
} = feedSlice.selectors;

export default feedSlice;
