import { rootReducer } from './store';
import { TIngredient } from '@utils-types';

describe('rootReducer', () => {
  test('should return initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: [],
        orderModalData: null,
        orderRequest: false,
        orderModalOpen: false
      },
      auth: {
        isAuthenticated: false,
        loading: false,
        error: null
      },
      user: {
        data: null,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      orders: {
        orders: [],
        loading: false,
        error: null,
        currentOrder: null
      }
    });
  });
});
