import { ALL_INFORMATION } from '../../graphql/information.ts';
import { useQuery } from '@apollo/client';
import useLoading from '../../hooks/useLoading.tsx';
import {Input, Flex, message, Table} from 'antd';
import {useEffect, useState} from "react";
import {SearchProps} from "antd/es/input";

const { Search } = Input;

const columns = [
  {
    title: 'Name',
    key: 'name',
    render: (_, record) => (
      <a href={`/employee/${record.id}`} target="_blank">{record.firstName} {record.lastName}</a>
    ),
  },
  {
    title: 'SSN',
    dataIndex: 'ssn',
    key: 'ssn',
  },
  {
    title: 'Work Authorization Title',
    dataIndex: 'workAuth',
    key: 'workAuth',
  },
  {
    title: 'Phone',
    dataIndex: 'cellPhone',
    key: 'cellPhone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
]

const EmployeeProfile = () => {
  const [search, setSearch] = useState('');

  const { showLoading } = useLoading();
  const { loading, error, data, refetch } = useQuery(ALL_INFORMATION, {
    variables: { search },
  });

  if (error) message.error(String(error));

  useEffect(() => {
    if (loading) showLoading(true);
    else showLoading(false);
  }, [loading]);

  const onSearch: SearchProps['onSearch'] = (value) => {
    setSearch(value);
    refetch().then();
  }

  return (
    <div className="content">
      <Flex justify="flex-end" style={{margin: 20}}>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
      </Flex>
      <Table dataSource={data?.allInformation} columns={columns} rowKey="id" tableLayout="fixed" scroll={{ y: 500, x: '100%' }}/>;
    </div>
  );
};

export default EmployeeProfile;