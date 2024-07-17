import {NameFormType, OnboardingInformationType} from '../utils/type.ts';
import {FC, useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import {Button, DatePicker, Flex, Form, Input, Radio, Card, message} from 'antd';
import {zodResolver} from "@hookform/resolvers/zod";
import {nameSchema} from "../utils/validation.ts";
import UploadImage from "./UploadImage.tsx";
import dayjs from "dayjs";
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { UPDATE_NAME_INFO } from '../graphql/information.ts';
import { useMutation } from '@apollo/client';
import useLoading from "../hooks/useLoading.tsx";

interface propsType {
  data: OnboardingInformationType,
  callback: () => void
}

const dateFormat = 'YYYY-MM-DD';

const NameForm: FC<propsType> = ({ data, callback }) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      firstName: '', lastName: '', middleName: '', preferredName: '', email: '', ssn: '', gender: ''},
    resolver: zodResolver(nameSchema)
  });

  const [editable, setEditable] = useState(false);
  const [picture, setPicture] = useState(data.picture);
  const [birthDate, setBirthDate] = useState(data.birthDate);

  const { showLoading } = useLoading();
  const [updateName] = useMutation(UPDATE_NAME_INFO);

  const resetForm = () => {
    setValue('firstName', data.firstName);
    setValue('lastName', data.lastName);
    setValue('middleName', data.middleName);
    setValue('preferredName', data.preferredName);
    setValue('email', data.email);
    setValue('ssn', data.ssn);
    setValue('gender', data.gender);

    setPicture(data.picture);
    setBirthDate(data.birthDate);
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

  const doSubmit = async (params: NameFormType) => {
    if (birthDate === '') return;

    const info = {
      ...params,
      birthDate: birthDate,
      picture: picture,
    };

    showLoading(true);
    try {
      await updateName({variables: { input: info }});
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
    <Card title="Name" extra={controlBtn()} style={{width: 700}}>
      <Form layout="vertical" disabled={!editable} style={{width: '600px', margin: '0 auto'}} onFinish={handleSubmit(doSubmit)}>
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
          <UploadImage disable={!editable} defaultUrl={picture} callback={(url) => {
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
        {
          editable &&
          <Form.Item style={{marginTop: 30}}>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>Save</Button>
          </Form.Item>
        }
      </Form>
    </Card>
  )
}

export default NameForm;