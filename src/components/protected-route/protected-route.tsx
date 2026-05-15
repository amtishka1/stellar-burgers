import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  getIsAuthenticated,
  getAuthLoading
} from '../../services/slices/authSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const authLoading = useSelector(getAuthLoading);

  if (authLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  return children;
};
