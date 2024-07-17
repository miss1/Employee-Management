import {ContactFormType, OnboardingInformationType} from '../utils/type.ts';
import {FC, useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import {Button, Flex, Form, Input, Card, message} from 'antd';
import {zodResolver} from "@hookform/resolvers/zod";
import {contactSchema} from "../utils/validation.ts";
import useLoading from "../hooks/useLoading.tsx";
import {useMutation} from "@apollo/client";
import {UPDATE_Contact_INFO} from "../graphql/information.ts";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";

interface propsType {
  data: OnboardingInformationType,
  callback: () => void
}

const ContactForm: FC<propsType> = ({ data, callback }) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {cellPhone: '', workPhone: ''},
    resolver: zodResolver(contactSchema)
  });

  const [editable, setEditable] = useState(false);

  const { showLoading } = useLoading();
  const [updateContact] = useMutation(UPDATE_Contact_INFO);

  useEffect(() => {
    setValue('cellPhone', data.cellPhone);
    setValue('workPhone', data.workPhone);
  }, [data]);

  const controlBtn = () => {
    if (editable) {
      return <CloseOutlined onClick={() => {
        setEditable(false);
        setValue('cellPhone', data.cellPhone);
        setValue('workPhone', data.workPhone);
      }}/>
    }
    return <EditOutlined onClick={() => {setEditable(true);}}/>
  };

  const doSubmit = async (params: ContactFormType) => {
    showLoading(true);
    try {
      await updateContact({variables: {input: params}});
      setEditable(false);
      message.success("Update successfully");
      callback();
    } catch (e) {
      console.error(String(e));
      message.error(String(e));
    } finally {
      showLoading(false);
    }
  };

  return (
    <Card title="Contact Info" extra={controlBtn()} style={{width: 700, marginTop: 20}}>
      <Form layout="vertical" disabled={!editable} style={{width: '600px', margin: '0 auto'}} onFinish={handleSubmit(doSubmit)}>
        <Flex justify="space-between">
          <FormItem control={control} name="cellPhone" label="Cell Phone" style={{width: '47%'}} required>
            <Input />
          </FormItem>
          <FormItem control={control} name="workPhone" label="Work Phone" style={{width: '47%'}}>
            <Input />
          </FormItem>
        </Flex>
        {
          editable &&
          <Form.Item style={{marginTop: 30}}>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>Save</Button>
          </Form.Item>
        }
      </Form>
    </Card>
  );
};

export default ContactForm;