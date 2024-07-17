import { UNFINISHED_DOCUMENTS } from '../../graphql/document.ts';
import { useQuery } from '@apollo/client';
import useLoading from '../../hooks/useLoading.tsx';
import {Button, Flex, message, Table} from 'antd';
import {useEffect} from "react";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Work Authorization',
    dataIndex: 'workAuth',
    key: 'workAuth',
  },
  {
    title: 'Start Date',
    dataIndex: 'workAuthStart',
    key: 'workAuthStart',
  },
  {
    title: 'End Date',
    dataIndex: 'workAuthEnd',
    key: 'workAuthEnd',
  },
  {
    title: 'Next Step',
    dataIndex: 'nextStep',
    key: 'nextStep',
    render: (text: Number) => (text === 0 ? 'Waiting for HR approval' : 'Waiting for the next document')
  },
  {
    title: 'Document awaiting approval',
    key: 'file',
    render: (_, record) => (
      record.nextStep === 0 ?
        <a target="_blank" href={record.file}>{record.fileType}</a>
        :
        ''
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      record.nextStep === 0 ?
        <Flex>
          <Button>Approve</Button>
          <Button>Reject</Button>
        </Flex> :
        <Button>Send Notification</Button>
    ),
  },
]

const VisaStatus = () => {
  const { showLoading } = useLoading();
  const { loading, error, data, refetch } = useQuery(UNFINISHED_DOCUMENTS);

  if (error) message.error(String(error));

  useEffect(() => {
    if (loading) showLoading(true);
    else showLoading(false);
  }, [loading]);

  return (
    <div className="content">
      <Table dataSource={data?.unfinishedDocument} columns={columns} rowKey="id" tableLayout="fixed"
             scroll={{y: 500, x: '100%'}}/>;
    </div>
  );
};

export default VisaStatus;