import {FC, useState} from 'react';
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { zodResolver } from "@hookform/resolvers/zod";
import {Button, Form, Flex, Input, message, DatePicker, Radio } from "antd";
import * as z from "zod";
import useLoading from '../hooks/useLoading.tsx';
import { addOnboardingSchema } from '../utils/util.ts';
import { OnboardingInformationType } from '../utils/type.ts';
import UploadFile from './UploadFile.tsx';
import { useAppSelector } from "../app/hooks.ts";

interface propsType {
  callback: (step: number, msg: string) => void
}

const OnboardingForm: FC<propsType> = ({ callback }) => {
  const user = useAppSelector((state) => state.user);
  const [picture, setPicture] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '', lastName: '', middleName: '', preferredName: '',
      addressLine: '', city: '', state: '', postalCode: '', cellPhone: '', workPhone: '', email: user.email, ssn: '',
      birthDate: '', gender: 'None', workAuth: '', workAuthStart: '', workAuthEnd: '', optReceipt: ''},
    resolver: zodResolver(addOnboardingSchema)
  });

  const doSubmit = (params: OnboardingInformationType) => {
    console.log(params);
  };

  return (
    <>
      <Form layout="vertical" style={{width: '600px', margin: '0 auto'}} onFinish={handleSubmit(doSubmit)}>
        <h2>Name</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="firstName" label="First Name" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
          <FormItem control={control} name="lastName" label="Last Name" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="middleName" label="Middle Name" style={{width: '47%'}}>
            <Input/>
          </FormItem>
          <FormItem control={control} name="preferredName" label="Preferred Name" style={{width: '47%'}}>
            <Input/>
          </FormItem>
        </Flex>
        <Flex vertical justify="center" align="center">
          <p>Profile Picture</p>
          <UploadFile callback={(url) => {
            setPicture(url)
          }}/>
        </Flex>
        <FormItem control={control} name="email" label="Email" required>
          <Input disabled={true}/>
        </FormItem>
        <Flex justify="space-between">
          <FormItem control={control} name="ssn" label="SSN" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
          <FormItem control={control} name="birthDate" label="Date of Birth" style={{width: '47%'}} required>
            <DatePicker style={{width: "100%"}}/>
          </FormItem>
        </Flex>
        <FormItem control={control} name="gender" label="Gender" required>
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="None">Do not wish to answer</Radio>
          </Radio.Group>
        </FormItem>
        <h2>Address</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="addressLine" label="Address Line 1" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
          <FormItem control={control} name="city" label="City" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="state" label="State" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
          <FormItem control={control} name="postalCode" label="Postal Code" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
        </Flex>
        <h2>Contact Info</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="cellPhone" label="Cell Phone" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
          <FormItem control={control} name="workPhone" label="Work Phone" style={{width: '47%'}}>
            <Input/>
          </FormItem>
        </Flex>
        <Form.Item style={{marginTop: 30}}>
          <Button type="primary" htmlType="submit" style={{width: '100%'}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default OnboardingForm;