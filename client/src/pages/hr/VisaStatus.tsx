import { UNFINISHED_DOCUMENTS, APPROVE_DOCUMENT, REJECT_DOCUMENT } from '../../graphql/document.ts';
import { useQuery, useMutation } from '@apollo/client';
import useLoading from '../../hooks/useLoading.tsx';
import {Button, Flex, Form, Input, message, Modal, Table} from 'antd';
import {useEffect, useState} from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormItem} from "react-hook-form-antd";

const schema = z.object({
  feedback: z
    .string()
    .min(1, { message: "Required" })
    .max(100, { message: "name should be less than 100 characters" }),
});

interface RejectType {
  feedback: string
}

const VisaStatus = () => {
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
      title: 'Document',
      key: 'file',
      render: (_, record) => (
        record.nextStep === 0 ?
          <a target="_blank" href={record.file}>{record.fileType}</a>
          :
          <span>{record.fileType}</span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.nextStep === 0 ?
          <Flex>
            <Button onClick={() => approveDoc(record.id)}>Approve</Button>
            <Button onClick={() => openDialog(record.id)}>Reject</Button>
          </Flex> :
          <Button>Send Notification</Button>
      ),
    },
  ]

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedID, setSelectedID] = useState('');
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { feedback: '' },
    resolver: zodResolver(schema)
  });

  const { showLoading } = useLoading();

  const [approveDocument] = useMutation(APPROVE_DOCUMENT);
  const [rejectDocument] = useMutation(REJECT_DOCUMENT);
  const { loading, error, data, refetch } = useQuery(UNFINISHED_DOCUMENTS);

  if (error) message.error(String(error));

  useEffect(() => {
    if (loading) showLoading(true);
    else showLoading(false);
  }, [loading]);

  const openDialog = (id: string) => {
    reset();
    setSelectedID(id);
    setModalOpen(true);
  };

  const approveDoc = async (id: string) => {
    showLoading(true);
    try {
      const {data} = await approveDocument({variables: {id}});
      message.success(data.approveDocument);
      setModalOpen(false);
      refetch().then();
    } catch (e) {
      console.error(String(e));
      message.error(String(e));
    } finally {
      showLoading(false);
    }
  };

  const doReject = async (params: RejectType) => {
    showLoading(true);
    try {
      const {data} = await rejectDocument({variables: {id: selectedID, feedback: params.feedback}});
      message.success(data.rejectDocument);
      setModalOpen(false);
      refetch().then();
    } catch (e) {
      console.error(String(e));
      message.error(String(e));
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="content">
      <Table dataSource={data?.unfinishedDocument} columns={columns} rowKey="id" tableLayout="fixed"
             scroll={{y: 500, x: '100%'}}/>;
      <Modal
        title="Reject Application" centered open={modalOpen}
        onOk={handleSubmit(doReject)}
        onCancel={() => setModalOpen(false)}>
        <Form>
          <FormItem control={control} name="feedback" label="Feedback" style={{textAlign: "left"}}>
            <Input />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default VisaStatus;