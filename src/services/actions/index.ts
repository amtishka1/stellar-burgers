export { fetchIngredients } from '../slices/ingredientsSlice';

export {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  closeOrderModal,
  orderBurger
} from '../slices/constructorSlice';

export { registerUser, loginUser, logoutUser } from '../slices/authSlice';

export { fetchUser, updateUser, setUser, clearUser } from '../slices/userSlice';

export { fetchFeeds } from '../slices/feedSlice';

export { fetchOrders, fetchOrder } from '../slices/ordersSlice';
