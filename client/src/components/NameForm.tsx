import { NameFormType, NameSectionType } from '../utils/type.ts';
import {FC, useState} from 'react';
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import {Button, DatePicker, Flex, Form, Input, Radio} from 'antd';
import {zodResolver} from "@hookform/resolvers/zod";
import {nameSchema} from "../utils/validation.ts";
import UploadImage from "./UploadImage.tsx";
import dayjs from "dayjs";

interface propsType {
  data: NameSectionType
}

const dateFormat = 'YYYY-MM-DD';

const NameForm: FC<propsType> = ({ data }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: data.firstName, lastName: data.lastName, middleName: data.middleName, preferredName: data.preferredName,
      email: data.email, ssn: data.ssn, gender: data.gender},
    resolver: zodResolver(nameSchema)
  });

  const [picture, setPicture] = useState(data.picture);
  const [birthDate, setBirthDate] = useState(data.birthDate);

  const doSubmit = async (params: NameFormType) => {
    console.log(params);
  };

  return (
    <>
      <Form layout="vertical" style={{width: '600px', margin: '0 auto'}} onFinish={handleSubmit(doSubmit)}>
        <Flex justify="space-between">
          <FormItem control={control} name="firstName" label="First Name" style={{width: '47%'}} required>
            <Input />
          </FormItem>
          <FormItem control={control} name="lastName" label="Last Name" style={{width: '47%'}} required>
            <Input />
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="middleName" label="Middle Name" style={{width: '47%'}}>
            <Input />
          </FormItem>
          <FormItem control={control} name="preferredName" label="Preferred Name" style={{width: '47%'}}>
            <Input />
          </FormItem>
        </Flex>
        <Flex vertical justify="center" align="center">
          <p>Profile Picture</p>
          <UploadImage disable={false} defaultUrl={picture} callback={(url) => {
            setPicture(url)
          }}/>
        </Flex>
        <FormItem control={control} name="email" label="Email" required>
          <Input disabled={true}/>
        </FormItem>
        <Flex justify="space-between">
          <FormItem control={control} name="ssn" label="SSN" style={{width: '47%'}} required>
            <Input />
          </FormItem>
          <div style={{width: "47%"}}>
            <p style={{margin: 0, paddingBottom: "8px"}}><span className="star">*</span>Birth Date</p>
            <DatePicker value={birthDate && dayjs(birthDate, dateFormat)} format={dateFormat} style={{width: "100%"}} onChange={(_data, text) => {
              setBirthDate(String(text));
            }}/>
            <div className="ant-form-item-explain-error"
                 style={{color: "#ff4d4f"}}>{birthDate ? '' : 'Required'}</div>
          </div>
        </Flex>
        <FormItem control={control} name="gender" label="Gender" required>
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="None">Do not wish to answer</Radio>
          </Radio.Group>
        </FormItem>
        <Form.Item style={{marginTop: 30}}>
          <Button type="primary" htmlType="submit" style={{width: '100%'}}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default NameForm;