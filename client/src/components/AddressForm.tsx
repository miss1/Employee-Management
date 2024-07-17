import {AddressFormType, OnboardingInformationType} from '../utils/type.ts';
import {FC, useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import {Button, Flex, Form, Input, Card, message} from 'antd';
import {zodResolver} from "@hookform/resolvers/zod";
import {addressSchema} from "../utils/validation.ts";
import useLoading from "../hooks/useLoading.tsx";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import {UPDATE_ADDRESS_INFO} from '../graphql/information.ts';
import { useMutation } from '@apollo/client';

interface propsType {
  data: OnboardingInformationType,
  callback: () => void
}

const AddressForm: FC<propsType> = ({ data, callback }) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {addressLine: '', city: '', state: '', postalCode: ''},
    resolver: zodResolver(addressSchema)
  });

  const [editable, setEditable] = useState(false);

  const { showLoading } = useLoading();
  const [updateAddress] = useMutation(UPDATE_ADDRESS_INFO);

  const resetForm = () => {
    setValue('addressLine', data.addressLine);
    setValue('city', data.city);
    setValue('state', data.state);
    setValue('postalCode', data.postalCode);
  };

  useEffect(() => {
    resetForm();
  }, [data]);

  const controlBtn = () => {
    if (editable) {
      return <CloseOutlined onClick={() => {
        setEditable(false);
        resetForm();
      }}/>
    }
    return <EditOutlined onClick={() => {setEditable(true);}}/>
  };

  const doSubmit = async (params: AddressFormType) => {
    showLoading(true);
    try {
      await updateAddress({variables: {input: params}});
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
    <Card title="Address" extra={controlBtn()} style={{width: 700, marginTop: 20}}>
      <Form layout="vertical" disabled={!editable} style={{width: '600px', margin: '0 auto'}} onFinish={handleSubmit(doSubmit)}>
        <Flex justify="space-between">
          <FormItem control={control} name="addressLine" label="Address Line 1" style={{width: '47%'}} required>
            <Input />
          </FormItem>
          <FormItem control={control} name="city" label="City" style={{width: '47%'}} required>
            <Input />
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="state" label="State" style={{width: '47%'}} required>
            <Input />
          </FormItem>
          <FormItem control={control} name="postalCode" label="Postal Code" style={{width: '47%'}} required>
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

export default AddressForm;