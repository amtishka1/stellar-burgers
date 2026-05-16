import { rootReducer } from './store';
import ingredientsSlice from './slices/ingredientsSlice';
import constructorSlice from './slices/constructorSlice';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import feedSlice from './slices/feedSlice';
import ordersSlice from './slices/ordersSlice';

const initAction = { type: '@@INIT' };

describe('rootReducer', () => {
  test('should return initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsSlice.reducer(undefined, initAction),
      burgerConstructor: constructorSlice.reducer(undefined, initAction),
      auth: authSlice.reducer(undefined, initAction),
      user: userSlice.reducer(undefined, initAction),
      feed: feedSlice.reducer(undefined, initAction),
      orders: ordersSlice.reducer(undefined, initAction)
    });
  });
});
