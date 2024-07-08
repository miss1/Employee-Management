import { Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from "../app/hooks.ts";
import './App.css'
import { ApolloProvider } from '@apollo/client';
import client from '../graphql/apolloClient.ts';

function App() {
  const showLoading = useAppSelector((state) => state.loading.show);

  return (
    <>
      <ApolloProvider client={client}>
        <div className="page">
          <Outlet/>
        </div>
      </ApolloProvider>
      <Spin spinning={showLoading} indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen/>
    </>
  )
}

export default App
