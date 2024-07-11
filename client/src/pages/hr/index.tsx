import Header from '../../components/Header.tsx';
import { Outlet } from 'react-router-dom';

const Hr = () => {
  return (
    <>
      <Header type="HR"/>
      <Outlet/>
    </>
  );
};

export default Hr;