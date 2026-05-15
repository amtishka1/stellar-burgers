import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  closeOrderModal,
  orderBurger
} from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
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
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Test Sauce',
  type: 'sauce',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('constructorSlice reducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderModalData: null,
    orderRequest: false,
    orderModalOpen: false
  };

  describe('addIngredient', () => {
    test('should add bun', () => {
      const action = addIngredient(mockBun);
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.bun).not.toBeNull();
      expect(newState.bun!._id).toBe('bun-1');
      expect((newState.bun as TConstructorIngredient).id).toBeDefined();
      expect(newState.ingredients).toHaveLength(0);
    });

    test('should replace bun when adding another bun', () => {
      const stateWithBun = {
        ...initialState,
        bun: { ...mockBun, id: 'existing-bun-id' } as TConstructorIngredient
      };

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Another Bun'
      };

      const action = addIngredient(newBun);
      const newState = constructorSlice.reducer(stateWithBun, action);

      expect(newState.bun!._id).toBe('bun-2');
    });

    test('should add non-bun ingredient to list', () => {
      const action = addIngredient(mockMain);
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe('main-1');
      expect(newState.ingredients[0].id).toBeDefined();
      expect(newState.bun).toBeNull();
    });

    test('should add multiple non-bun ingredients', () => {
      const stateWithMain = constructorSlice.reducer(
        initialState,
        addIngredient(mockMain)
      );
      const stateWithBoth = constructorSlice.reducer(
        stateWithMain,
        addIngredient(mockSauce)
      );

      expect(stateWithBoth.ingredients).toHaveLength(2);
      expect(stateWithBoth.ingredients[0]._id).toBe('main-1');
      expect(stateWithBoth.ingredients[1]._id).toBe('sauce-1');
    });
  });

  describe('removeIngredient', () => {
    test('should remove ingredient by id', () => {
      const addAction = addIngredient(mockMain);
      const stateWithIngredient = constructorSlice.reducer(
        initialState,
        addAction
      );
      const ingredientId = stateWithIngredient.ingredients[0].id;

      const newState = constructorSlice.reducer(
        stateWithIngredient,
        removeIngredient(ingredientId)
      );

      expect(newState.ingredients).toHaveLength(0);
    });

    test('should remove correct ingredient when multiple exist', () => {
      const stateWithMains = constructorSlice.reducer(
        initialState,
        addIngredient(mockMain)
      );
      const stateWithBoth = constructorSlice.reducer(
        stateWithMains,
        addIngredient(mockSauce)
      );
      const sauceId = stateWithBoth.ingredients[1].id;

      const newState = constructorSlice.reducer(
        stateWithBoth,
        removeIngredient(sauceId)
      );

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]._id).toBe('main-1');
    });

    test('should not affect bun when removing ingredient', () => {
      const stateWithBun = constructorSlice.reducer(
        initialState,
        addIngredient(mockBun)
      );
      const stateWithIngredient = constructorSlice.reducer(
        stateWithBun,
        addIngredient(mockMain)
      );
      const mainId = stateWithIngredient.ingredients[0].id;

      const newState = constructorSlice.reducer(
        stateWithIngredient,
        removeIngredient(mainId)
      );

      expect(newState.bun).not.toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredient', () => {
    test('should move ingredient up', () => {
      const stateWithMains = constructorSlice.reducer(
        initialState,
        addIngredient(mockMain)
      );
      const stateWithBoth = constructorSlice.reducer(
        stateWithMains,
        addIngredient(mockSauce)
      );

      expect(stateWithBoth.ingredients[0]._id).toBe('main-1');
      expect(stateWithBoth.ingredients[1]._id).toBe('sauce-1');

      const newState = constructorSlice.reducer(
        stateWithBoth,
        moveIngredient({ index: 1, direction: 'up' })
      );

      expect(newState.ingredients[0]._id).toBe('sauce-1');
      expect(newState.ingredients[1]._id).toBe('main-1');
    });

    test('should move ingredient down', () => {
      const stateWithMains = constructorSlice.reducer(
        initialState,
        addIngredient(mockMain)
      );
      const stateWithBoth = constructorSlice.reducer(
        stateWithMains,
        addIngredient(mockSauce)
      );

      expect(stateWithBoth.ingredients[0]._id).toBe('main-1');
      expect(stateWithBoth.ingredients[1]._id).toBe('sauce-1');

      const newState = constructorSlice.reducer(
        stateWithBoth,
        moveIngredient({ index: 0, direction: 'down' })
      );

      expect(newState.ingredients[0]._id).toBe('sauce-1');
      expect(newState.ingredients[1]._id).toBe('main-1');
    });

    test('should not move first ingredient up', () => {
      const stateWithIngredient = constructorSlice.reducer(
        initialState,
        addIngredient(mockMain)
      );

      const newState = constructorSlice.reducer(
        stateWithIngredient,
        moveIngredient({ index: 0, direction: 'up' })
      );

      expect(newState.ingredients).toHaveLength(1);
    });

    test('should not move last ingredient down', () => {
      const stateWithIngredient = constructorSlice.reducer(
        initialState,
        addIngredient(mockMain)
      );

      const newState = constructorSlice.reducer(
        stateWithIngredient,
        moveIngredient({ index: 0, direction: 'down' })
      );

      expect(newState.ingredients).toHaveLength(1);
    });
  });

  describe('resetConstructor', () => {
    test('should reset constructor state', () => {
      const stateWithItems = constructorSlice.reducer(
        initialState,
        addIngredient(mockBun)
      );
      const newState = constructorSlice.reducer(
        stateWithItems,
        resetConstructor()
      );

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });
  });

  describe('closeOrderModal', () => {
    test('should close order modal and clear data', () => {
      const stateWithModal = {
        ...initialState,
        orderModalOpen: true,
        orderModalData: { _id: '1', number: 123 } as any
      };

      const newState = constructorSlice.reducer(
        stateWithModal,
        closeOrderModal()
      );

      expect(newState.orderModalOpen).toBe(false);
      expect(newState.orderModalData).toBeNull();
    });
  });

  describe('orderBurger async thunk', () => {
    test('should set orderRequest on pending', () => {
      const action = { type: orderBurger.pending.type };
      const newState = constructorSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(true);
    });

    test('should handle fulfilled', () => {
      const mockOrder = {
        _id: 'order-1',
        number: 55555,
        name: 'Test Burger',
        status: 'done',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        ingredients: ['bun-1', 'main-1', 'bun-1']
      };

      const stateWithItems = {
        bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        ingredients: [{ ...mockMain, id: 'main-id' } as TConstructorIngredient],
        orderModalData: null,
        orderRequest: true,
        orderModalOpen: false
      };

      const action = {
        type: orderBurger.fulfilled.type,
        payload: mockOrder
      };
      const newState = constructorSlice.reducer(stateWithItems, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toEqual(mockOrder);
      expect(newState.orderModalOpen).toBe(true);
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(0);
    });

    test('should handle rejected', () => {
      const stateWithRequest = {
        ...initialState,
        orderRequest: true
      };

      const action = { type: orderBurger.rejected.type };
      const newState = constructorSlice.reducer(stateWithRequest, action);

      expect(newState.orderRequest).toBe(false);
    });
  });
});
