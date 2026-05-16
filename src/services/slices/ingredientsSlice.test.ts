import ingredientsSlice, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Test Bun',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: 'main-1',
    name: 'Test Main',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  test('should set loading true on pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const newState = ingredientsSlice.reducer(initialState, action);

    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  test('should set ingredients on fulfilled', () => {
    const pendingAction = { type: fetchIngredients.pending.type };
    const loadingState = ingredientsSlice.reducer(initialState, pendingAction);

    const fulfilledAction = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientsSlice.reducer(loadingState, fulfilledAction);

    expect(newState.loading).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients);
    expect(newState.ingredients).toHaveLength(2);
  });

  test('should set error on rejected', () => {
    const pendingAction = { type: fetchIngredients.pending.type };
    const loadingState = ingredientsSlice.reducer(initialState, pendingAction);

    const rejectedAction = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Network Error' }
    };
    const newState = ingredientsSlice.reducer(loadingState, rejectedAction);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Network Error');
  });

  test('should set default error on rejected without message', () => {
    const rejectedAction = {
      type: fetchIngredients.rejected.type,
      error: {}
    };
    const newState = ingredientsSlice.reducer(initialState, rejectedAction);

    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка загрузки ингредиентов');
  });

  test('should handle full cycle: pending -> fulfilled', () => {
    const pendingAction = { type: fetchIngredients.pending.type };
    let state = ingredientsSlice.reducer(initialState, pendingAction);
    expect(state.loading).toBe(true);

    const fulfilledAction = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    state = ingredientsSlice.reducer(state, fulfilledAction);

    expect(state.loading).toBe(false);
    expect(state.ingredients).toHaveLength(2);
    expect(state.error).toBeNull();
  });

  test('should handle full cycle: pending -> rejected', () => {
    const pendingAction = { type: fetchIngredients.pending.type };
    let state = ingredientsSlice.reducer(initialState, pendingAction);
    expect(state.loading).toBe(true);

    const rejectedAction = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Server Error' }
    };
    state = ingredientsSlice.reducer(state, rejectedAction);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Server Error');
    expect(state.ingredients).toHaveLength(0);
  });
});
