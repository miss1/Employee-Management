import {FC} from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Flex, Menu } from 'antd';
import type { MenuProps } from 'antd';
import style from './header.module.css';
import { useAppSelector } from "../app/hooks.ts";
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  type: string
}

type MenuItem = Required<MenuProps>['items'][number];

const HRItems: MenuItem[] = [
  {
    label: 'Employee Profiles',
    key: '/hr',
  },
  {
    label: 'Visa Status Management',
    key: '/hr/visa',
  },
  {
    label: 'Hiring Management',
    key: '/hr/hiring',
  },
];

const EMItems: MenuItem[] = [
  {
    label: 'Personal Information',
    key: '/employee',
  },
  {
    label: 'Visa Status Management',
    key: '/employee/visa',
  },
];

const Header: FC<HeaderProps> = ({ type }) => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const cleanPathname = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;

  const doLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className={style.header}>
      <Menu onClick={(e) => {navigate(e.key);}} selectedKeys={[cleanPathname]}
            mode="horizontal" style={{ minWidth: 0, flex: "auto" }} items={type === 'HR' ? HRItems : EMItems} />
      <Flex gap="small" align="center">
        <UserOutlined style={{fontSize: 20}}/>
        <p>Welcome! {user.username}</p>
        <Button type="primary" size="small" onClick={doLogout}>Logout</Button>
      </Flex>
    </div>
  );
};

export default Header;