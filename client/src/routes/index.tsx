import { createBrowserRouter } from 'react-router-dom';
import App from '../pages/App.tsx';
import ErrorPage from '../pages/Error.tsx';
import ProtectedHrRoute from './ProtectedHrRoute.tsx';
import ProtectedEmRoute from './ProtectedEmRoute.tsx';
import LoginPage from '../pages/Login.tsx';
import RegistrationPage from '../pages/Registration.tsx';
import HrPage from '../pages/hr';
import EmployeePage from '../pages/employee';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage />,

    children: [
      {
        path: '/',
        element: <LoginPage />,
        errorElement: <ErrorPage />
      },
      {
        path: '/registration/:token',
        element: <RegistrationPage />,
        errorElement: <ErrorPage />
      },
      {
        path: '/hr',
        element: <ProtectedHrRoute><HrPage /></ProtectedHrRoute>,
        errorElement: <ErrorPage />
      },
      {
        path: '/employee',
        element: <ProtectedEmRoute><EmployeePage/></ProtectedEmRoute>,
        errorElement: <ErrorPage />
      },
    ]
  },
]);

export default router;