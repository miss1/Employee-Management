import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Card } from "antd";
import * as z from "zod";
import { LoginParamsType } from "../utils/type.ts";
import { useAppDispatch } from '../app/hooks';
import { doLogin } from '../app/slice/user.ts';

const schema = z.object({
  username: z
    .string()
    .min(1, { message: "Required" })
    .max(15, { message: "Username should be less than 15 characters" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters" })
});

const Login = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: { username: '', password: '' },
    resolver: zodResolver(schema)
  });

  const dispatch = useAppDispatch();

  const doSubmit = async (params: LoginParamsType) => {
    await dispatch(doLogin(params));
  };

  return (
    <>
      <h1 style={{marginBottom: 50}}>Employee Management</h1>
      <Card title="Login" bordered={false} style={{width: 430, textAlign: "center"}}>
        <Form onFinish={handleSubmit(doSubmit)}>
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

export default Login;