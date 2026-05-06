import {
  createAsyncThunk,
  nanoid,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { RootState } from '../store';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orderModalOpen: boolean;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderModalData: null,
  orderRequest: false,
  orderModalOpen: false
};

export const orderBurger = createAsyncThunk(
  'constructor/orderBurger',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);

    const order: TOrder = {
      _id: data.order._id,
      number: data.order.number,
      name: data.order.name,
      status: data.order.status,
      createdAt: data.order.createdAt,
      updatedAt: data.order.updatedAt,
      ingredients: ingredients
    };

    return order;
  }
);

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: { payload: TConstructorIngredient }) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: { payload: string }) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: { payload: { index: number; direction: 'up' | 'down' } }
    ) => {
      const { index, direction } = action.payload;
      if (direction === 'up' && index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      } else if (direction === 'down' && index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    closeOrderModal: (state) => {
      state.orderModalOpen = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.orderModalOpen = true;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      });
  },
  selectors: {
    getOrderModalData: (state) => state.orderModalData,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalOpen: (state) => state.orderModalOpen
  }
});

export const getConstructorItems = createSelector(
  (state: RootState) => state.burgerConstructor.bun,
  (state: RootState) => state.burgerConstructor.ingredients,
  (bun, ingredients) => ({ bun, ingredients })
);

export const { getOrderModalData, getOrderRequest, getOrderModalOpen } =
  constructorSlice.selectors;

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  closeOrderModal
} = constructorSlice.actions;

export default constructorSlice;
