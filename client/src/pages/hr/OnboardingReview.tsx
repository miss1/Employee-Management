import { useQuery } from '@apollo/client';
import { APPLICATIONS } from '../../graphql/information';
import useLoading from '../../hooks/useLoading.tsx';
import {message, Table, Radio, Flex} from 'antd';
import type { TableProps } from 'antd';
import {useEffect, useState} from "react";

interface DataType {
  id: string;
  firstName: string;
  lastName: number;
  email: string;
}

const columns:TableProps<DataType>['columns'] = [
  {
    title: 'Full Name',
    key: 'name',
    render: (_, record) => <span>{record.firstName} {record.lastName}</span>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'View Application',
    dataIndex: 'action',
    render: (_, record) => (
      <a target="_blank" href={`/application/${record.id}`}>Detail</a>
    )
  },
]

const OnboardingReview = () => {
  const [onboarding, setOnboarding] = useState('pending');

  const { showLoading } = useLoading();
  const { loading, error, data, refetch } = useQuery(APPLICATIONS, {
    variables: { onboarding },
  });

  if (error) message.error(String(error));

  useEffect(() => {
    refetch().then();
  }, [onboarding]);

  useEffect(() => {
    if (loading) showLoading(true);
    else showLoading(false);
  }, [loading]);

  return (
    <div className="content">
      <Flex justify="flex-end" style={{margin: '10px 20px'}}>
        <Radio.Group onChange={(e) => {setOnboarding(e.target.value)}} value={onboarding}>
          <Radio value="pending">pending</Radio>
          <Radio value="approved">approved</Radio>
          <Radio value="rejected">rejected</Radio>
        </Radio.Group>
      </Flex>
      <Table dataSource={data?.applications} columns={columns} rowKey="id" tableLayout="fixed" scroll={{ y: 500, x: '100%' }}/>;
    </div>
  );
};

export default OnboardingReview;