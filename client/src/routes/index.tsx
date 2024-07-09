import { createBrowserRouter } from 'react-router-dom';
import App from '../pages/App.tsx';
import ErrorPage from '../pages/Error.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import LoginPage from '../pages/Login.tsx';
import RegistrationPage from '../pages/Registration.tsx';
import HrPage from '../pages/hr';
import EmployeePage from '../pages/employee';
import EmployeeProfile from '../pages/hr/EmployeeProfile.tsx';
import VisaStatus from '../pages/hr/VisaStatus.tsx';
import HiringManagement from '../pages/hr/HiringManagement.tsx';
import PersonalInfo from '../pages/employee/PersonalInfo.tsx';
import EmVisaStatus from '../pages/employee/VisaStatus.tsx';

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
        // element: <ProtectedRoute type='hr'><HrPage /></ProtectedRoute>,
        element: <HrPage />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '/hr',
            element: <EmployeeProfile />,
            errorElement: <ErrorPage />
          },
          {
            path: '/hr/visa',
            element: <VisaStatus />,
            errorElement: <ErrorPage />
          },
          {
            path: '/hr/hiring',
            element: <HiringManagement />,
            errorElement: <ErrorPage />
          }
        ]
      },
      {
        path: '/employee',
        // element: <ProtectedRoute type='employee'><EmployeePage/></ProtectedRoute>,
        element: <EmployeePage/>,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '/employee',
            element: <PersonalInfo />,
            errorElement: <ErrorPage />
          },
          {
            path: '/employee/visa',
            element: <EmVisaStatus />,
            errorElement: <ErrorPage />
          },
        ]
      },
    ]
  },
  {
    path: '/error',
    element: <ErrorPage />
  }
]);

export default router;