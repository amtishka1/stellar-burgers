import ingredients from './ingredients.json';

interface TIngredient {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
}

interface TOrder {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
}

export const mockIngredients: TIngredient[] = ingredients as TIngredient[];

export const mockBun = mockIngredients[0];
export const mockMain = mockIngredients[1];
export const mockSauce = mockIngredients[2];

export const mockOrder: TOrder = {
  _id: 'test-order-123',
  number: 55555,
  name: 'Test Burger',
  status: 'done',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ingredients: [mockBun._id, mockMain._id, mockSauce._id, mockBun._id]
};

export const mockIngredientsResponse = {
  success: true,
  data: mockIngredients
};

export const mockOrderResponse = {
  success: true,
  name: 'Test Burger',
  order: {
    _id: mockOrder._id,
    status: mockOrder.status,
    name: mockOrder.name,
    createdAt: mockOrder.createdAt,
    updatedAt: mockOrder.updatedAt,
    number: mockOrder.number,
    price: 100,
    owner: {
      name: 'Test User',
      email: 'test@test.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  }
};

export const mockUserResponse = {
  success: true,
  user: {
    email: 'test@test.com',
    name: 'Test User'
  }
};
