export { fetchIngredients } from '../slices/ingredientsSlice';

export {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  closeOrderModal,
  orderBurger
} from '../slices/constructorSlice';

export {
  registerUser,
  loginUser,
  logoutUser,
  setUser
} from '../slices/authSlice';

export { fetchUser, updateUser } from '../slices/userSlice';

export { fetchFeeds } from '../slices/feedSlice';

export { fetchOrders } from '../slices/ordersSlice';
