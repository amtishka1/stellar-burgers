import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getFeedOrders,
  getFeedLoading,
  getFeedTotal,
  getFeedTotalToday
} from '../../services/slices/feedSlice';
import { fetchFeeds } from '../../services/actions';
import { getIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const loading = useSelector(getFeedLoading);
  const total = useSelector(getFeedTotal);
  const totalToday = useSelector(getFeedTotalToday);
  const ingredients = useSelector(getIngredients);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!orders.length || loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
