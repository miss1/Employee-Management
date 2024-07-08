import { Navigate } from 'react-router-dom';
import { FC, ReactNode } from 'react';
import { useAppSelector } from '../app/hooks';

interface ProtectedRouteProps {
  children: ReactNode,
  type: string
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, type}): ReactNode => {
  const token: string = useAppSelector((state) => state.user.token);
  const role: string = useAppSelector((state) => state.user.role);

  if (!token || type !== role) {
    localStorage.clear();
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;