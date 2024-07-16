import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Card, message } from "antd";
import * as z from "zod";
import { RegistrationParamsType } from "../utils/type.ts";
import { useParams } from "react-router-dom";
import { parseToken } from "../utils/util.ts";
import { useNavigate } from 'react-router-dom';
import {useEffect} from "react";
import { useMutation } from '@apollo/client';
import { REGISTER } from '../graphql/user.ts';
import useLoading from '../hooks/useLoading.tsx';

interface tokenType {
  email: string
}

const schema = z.object({
  username: z
    .string()
    .min(1, { message: "Required" })
    .max(15, { message: "Username should be less than 15 characters" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
  token: z.string().min(1, { message: "Required" }),
  email: z.string().email("Invalid email address"),
});

const Registration = () => {
  const navigate = useNavigate();

  const token = useParams().token || '';
  const info: tokenType | null = parseToken(token);

  const { control, handleSubmit } = useForm({
    defaultValues: { username: '', password: '', token: token, email: '' },
    resolver: zodResolver(schema)
  });

  const { showLoading } = useLoading();
  const [register] = useMutation(REGISTER);

  useEffect(() => {
    if (!info) {
      navigate('/error');
    }
  }, []);

  const doSubmit = async (params: RegistrationParamsType) => {
    showLoading(true);
    try {
      const { data } = await register({variables: params});
      message.success(data.register);
      navigate('/');
    } catch (e) {
      console.error(String(e));
      message.error(String(e));
    } finally {
      showLoading(false);
    }
  };

  return (
    <>
      <h1 style={{marginBottom: 50}}>Employee Management</h1>
      <Card title="Registration" bordered={false} style={{width: 430, textAlign: "center"}}>
        <Form onFinish={handleSubmit(doSubmit)}>
          <FormItem control={control} name="token" label="Token" style={{textAlign: "left", display: "none"}}>
            <Input />
          </FormItem>
          <FormItem control={control} name="email" label="Email" style={{textAlign: "left"}}>
            <Input />
          </FormItem>
          <FormItem control={control} name="username" label="Username" style={{textAlign: "left"}}>
            <Input />
          </FormItem>
          <FormItem control={control} name="password" label="Password" style={{textAlign: "left", marginTop: 10}}>
            <Input.Password />
          </FormItem>
          <Form.Item style={{marginTop: 30}}>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Registration;