import ordersSlice, { fetchOrders, fetchOrder } from './ordersSlice';

describe('ordersSlice reducer', () => {
  const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  };

  const mockOrders = [
    {
      _id: 'order-1',
      number: 11111,
      name: 'Order 1',
      status: 'done',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      ingredients: ['bun-1', 'main-1', 'bun-1']
    }
  ];

  describe('fetchOrders', () => {
    test('should set loading true on pending', () => {
      const action = { type: fetchOrders.pending.type };
      const newState = ordersSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should set orders on fulfilled', () => {
      const action = {
        type: fetchOrders.fulfilled.type,
        payload: mockOrders
      };
      const newState = ordersSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.orders).toEqual(mockOrders);
      expect(newState.orders).toHaveLength(1);
    });

    test('should set error on rejected', () => {
      const action = {
        type: fetchOrders.rejected.type,
        error: { message: 'Orders Error' }
      };
      const newState = ordersSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Orders Error');
    });

    test('should set default error on rejected without message', () => {
      const action = { type: fetchOrders.rejected.type, error: {} };
      const newState = ordersSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки заказов');
    });
  });

  describe('fetchOrder', () => {
    const mockCurrentOrder = {
      _id: 'order-3',
      number: 33333,
      name: 'Current Order',
      status: 'done',
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
      ingredients: ['bun-1', 'sauce-1', 'bun-1']
    };

    test('should set loading true on pending', () => {
      const action = { type: fetchOrder.pending.type };
      const newState = ordersSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should set currentOrder on fulfilled', () => {
      const action = {
        type: fetchOrder.fulfilled.type,
        payload: mockCurrentOrder
      };
      const newState = ordersSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.currentOrder).toEqual(mockCurrentOrder);
    });

    test('should set error on rejected', () => {
      const action = {
        type: fetchOrder.rejected.type,
        error: { message: 'Order fetch failed' }
      };
      const newState = ordersSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Order fetch failed');
    });
  });
});
