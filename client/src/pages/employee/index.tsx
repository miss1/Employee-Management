import Header from '../../components/Header.tsx';
import { Outlet } from 'react-router-dom';

const Employee = () => {
  return (
    <>
      <Header type="Employee"/>
      <Outlet/>
    </>
  );
};

export default Employee;