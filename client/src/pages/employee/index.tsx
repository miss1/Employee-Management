import Header from '../../components/header';
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