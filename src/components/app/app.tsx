import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { getIngredientsLoading } from '../../services/slices/ingredientsSlice';
import { fetchIngredients, fetchUser } from '../../services/actions';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getIsAuthenticated } from '../../services/slices/authSlice';

import '../../index.css';
import styles from './app.module.css';

const OrderModal = () => {
  const { number } = useParams();
  const navigate = useNavigate();

  return (
    <Modal title={`#${number}`} onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};

const OrderPage = () => <OrderInfo />;

const IngredientPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Назад
      </button>
      <IngredientDetails />
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isIngredientsLoading = useSelector(getIngredientsLoading);
  const isAuthenticated = useSelector(getIsAuthenticated);

  useEffect(() => {
    dispatch(fetchIngredients());
    if (isAuthenticated) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated]);

  const backgroundLocation = location.state?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <Routes location={backgroundLocation || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderPage />} />
          <Route path='/ingredients/:id' element={<IngredientPage />} />
          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}

      {backgroundLocation && (
        <Routes>
          <Route path='/feed/:number' element={<OrderModal />} />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
