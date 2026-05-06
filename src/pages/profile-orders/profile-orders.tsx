import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getProfileOrders,
  getProfileOrdersLoading
} from '../../services/slices/ordersSlice';
import { fetchOrders } from '../../services/actions';
import { getIngredients } from '../../services/slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getProfileOrders);
  const loading = useSelector(getProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
