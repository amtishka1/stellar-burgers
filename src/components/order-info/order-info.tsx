import { FC, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const ingredients = useSelector(getIngredients);

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (number) {
      setLoading(true);
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.orders && res.orders.length > 0) {
            setOrderData(res.orders[0]);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [number]);

  const orderInfo = (() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  })();

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
