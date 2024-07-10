import { GET_REGISTRATIONS } from '../../graphql/registration.ts';
import { useQuery } from '@apollo/client';
import useLoading from '../../hooks/useLoading.tsx';
import { message, Table } from 'antd';
import {useEffect} from "react";
import { useAppSelector } from '../../app/hooks';

const columns = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Registration Link',
    dataIndex: 'link',
    key: 'link',
    width: 'auto',
    className: 'table-column',
  },
  {
    title: 'Submitted onboarding application',
    dataIndex: 'submitted',
    key: 'submitted',
    width: 300,
    render: (text: boolean) => (text ? 'Yes' : 'No')
  },
]

const TokenHistory = () => {
  const updateHistory = useAppSelector((state) => state.notification.tokenHistory);

  const { showLoading } = useLoading();
  const { loading, error, data, refetch } = useQuery(GET_REGISTRATIONS);

  if (error) message.error(String(error));

  useEffect(() => {
    refetch().then();
  }, [updateHistory]);

  useEffect(() => {
    if (loading) showLoading(true);
    else showLoading(false);
  }, [loading]);

  return (
    <div className="content">
      <Table dataSource={data?.registrations} columns={columns} rowKey="id" tableLayout="fixed" scroll={{ y: 500, x: '100%' }}/>;
    </div>
  );
};

export default TokenHistory;