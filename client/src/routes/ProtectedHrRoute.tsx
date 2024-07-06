import { Navigate } from 'react-router-dom';
import { FC, ReactNode } from 'react';
import { useAppSelector } from '../app/hooks';

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedHrRoute: FC<ProtectedRouteProps> = ({ children}): ReactNode => {
  const token: string = useAppSelector((state) => state.user.token);
  const role: string = useAppSelector((state) => state.user.role);

  if (!token || role !== 'HR') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedHrRoute;