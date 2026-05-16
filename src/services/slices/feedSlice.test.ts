import feedSlice, { fetchFeeds } from './feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    number: 11111,
    name: 'Test Order 1',
    status: 'done',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ingredients: ['bun-1', 'main-1', 'bun-1']
  },
  {
    _id: 'order-2',
    number: 22222,
    name: 'Test Order 2',
    status: 'pending',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    ingredients: ['bun-2', 'sauce-1', 'bun-2']
  }
];

describe('feedSlice reducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  test('should set loading true on pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const newState = feedSlice.reducer(initialState, action);

    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('should set orders and totals on fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: { orders: mockOrders, total: 100, totalToday: 5 }
    };
    const newState = feedSlice.reducer(
      { ...initialState, loading: true },
      action
    );

    expect(newState.loading).toBe(false);
    expect(newState.orders).toEqual(mockOrders);
    expect(newState.orders).toHaveLength(2);
    expect(newState.total).toBe(100);
    expect(newState.totalToday).toBe(5);
  });

  test('should set error on rejected', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Feed Error' }
    };
    const newState = feedSlice.reducer(
      { ...initialState, loading: true },
      action
    );

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Feed Error');
  });

  test('should set default error on rejected without message', () => {
    const action = { type: fetchFeeds.rejected.type, error: {} };
    const newState = feedSlice.reducer(initialState, action);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка загрузки ленты');
  });
});
