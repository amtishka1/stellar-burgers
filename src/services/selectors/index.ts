export {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError
} from '../slices/ingredientsSlice';

export {
  getConstructorItems,
  getOrderModalData,
  getOrderRequest,
  getOrderModalOpen
} from '../slices/constructorSlice';

export {
  getIsAuthenticated,
  getUser,
  getAuthLoading,
  getAuthError
} from '../slices/authSlice';

export { getUserData, getUserLoading, getUserError } from '../slices/userSlice';

export {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedLoading,
  getFeedError
} from '../slices/feedSlice';

export {
  getProfileOrders,
  getProfileOrdersLoading,
  getProfileOrdersError
} from '../slices/ordersSlice';
