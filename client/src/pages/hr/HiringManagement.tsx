import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {Flex, Button, Space, Radio, Modal, Form, Input, message} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { RegistrationTokenType } from "../../utils/type.ts";
import { useMutation } from '@apollo/client';
import { CREATE_REGISTRATION } from '../../graphql/registration.ts';
import useLoading from '../../hooks/useLoading.tsx';
import { useAppDispatch } from '../../app/hooks';
import { updateTokenHistory } from '../../app/slice/notification.ts';

const schema = z.object({
  name: z
    .string()
    .min(1, { message: "Required" })
    .max(15, { message: "name should be less than 15 characters" }),
  email: z.string().email("Invalid email address"),
});

const HiringManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cleanPathname = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;

  const dispatch = useAppDispatch();
  const { showLoading } = useLoading();
  const [modalOpen, setModalOpen] = useState(false);

  const [createRegistration] = useMutation(CREATE_REGISTRATION);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { name: '', email: '' },
    resolver: zodResolver(schema)
  });

  const openDialog = () => {
    reset();
    setModalOpen(true);
  };

  const doSubmitToken = async (params: RegistrationTokenType) => {
    showLoading(true);
    try {
      const { data } = await createRegistration({ variables: params });
      message.success(data.createRegistration);
      reset();
      dispatch(updateTokenHistory());
    } catch (e) {
      console.error(String(e));
      message.error(String(e));
    } finally {
      showLoading(false);
    }
  };

  return (
    <>
      <Flex justify="space-between" style={{width: '100%', margin: '20px 0', padding: '0 20px', boxSizing: 'border-box'}}>
        <Button type="primary" onClick={openDialog}>Generate token and send email</Button>
        <Space>
          <Radio.Group value={cleanPathname} onChange={(e) => navigate(e.target.value)}>
            <Radio.Button value="/hr/hiring">Token History</Radio.Button>
            <Radio.Button value="/hr/hiring/onboarding">Onboarding Review</Radio.Button>
          </Radio.Group>
        </Space>
      </Flex>
      <Outlet />
      <Modal
        title="Generate token and send email" centered open={modalOpen}
        onOk={handleSubmit(doSubmitToken)}
        onCancel={() => setModalOpen(false)}>
        <Form>
          <FormItem control={control} name="name" label="Name" style={{textAlign: "left"}}>
            <Input />
          </FormItem>
          <FormItem control={control} name="email" label="Email" style={{textAlign: "left"}}>
            <Input />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default HiringManagement;