import { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Flex, Input, message, DatePicker, Radio, RadioChangeEvent } from "antd";
import useLoading from '../hooks/useLoading.tsx';
import { addOnboardingSchema } from '../utils/validation.ts';
import { OnboardingInformationType } from '../utils/type.ts';
import UploadImage from './UploadImage.tsx';
import UploadFile from './UploadFile.tsx';
import { useAppSelector } from "../app/hooks.ts";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

interface propsType {
  callback: (step: number, msg: string) => void
}

const { RangePicker } = DatePicker;

const OnboardingForm: FC<propsType> = ({ callback }) => {
  const user = useAppSelector((state) => state.user);
  const [picture, setPicture] = useState('');
  const [optReceipt, setOptReceipt] = useState('');
  const [citizenStatus, setCitizenStatus] = useState(true);
  const [workAuthRange, setWorkAuthRange] = useState('');

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      firstName: '', lastName: '', middleName: '', preferredName: '',
      addressLine: '', city: '', state: '', postalCode: '', cellPhone: '', workPhone: '', email: user.email, ssn: '',
      birthDate: null, gender: 'None', workAuth: 'GreenCard', workAuthOther: '',
      reference: {firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: ''},
      emergencyContacts: [{firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: ''}]
    },
    resolver: zodResolver(addOnboardingSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emergencyContacts'
  });

  const watchWorkAuth = watch("workAuth", 'GreenCard');

  useEffect(() => {

  }, []);

  const changeCitizenStatus = (e: RadioChangeEvent) => {
    setCitizenStatus(e.target.value);
    setValue('workAuth', e.target.value ? 'GreenCard' : 'H1-B');
  };

  const doSubmit = (params: OnboardingInformationType) => {
    console.log(params);
    console.log(optReceipt);
    console.log(picture)
    console.log(workAuthRange);
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
          <UploadImage callback={(url) => {
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
            <DatePicker format="YYYY-MM-DD" style={{width: "100%"}} />
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
        <h2>Employment</h2>
        <div>
          <label>Permanent resident or citizen of the U.S.?</label>
          <Radio.Group onChange={changeCitizenStatus} value={citizenStatus} style={{margin: "0 20px"}}>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </div>
        {
          citizenStatus
            ? (
              <FormItem control={control} name="workAuth" label="Status" required>
                <Radio.Group>
                  <Radio value="GreenCard">Green Card</Radio>
                  <Radio value="Citizen">Citizen</Radio>
                </Radio.Group>
              </FormItem>
            )
            : (
              <FormItem control={control} name="workAuth" label="What is your work authorization?" required>
                <Radio.Group>
                  <Radio value="H1-B">H1-B</Radio>
                  <Radio value="L2">L2</Radio>
                  <Radio value="F1">F1(CPT/OPT)</Radio>
                  <Radio value="H4">H4</Radio>
                  <Radio value="Other">Other</Radio>
                </Radio.Group>
              </FormItem>
            )
        }
        {watchWorkAuth === 'Other' && (
          <FormItem control={control} name="workAuthOther" label="Please specify your visa title" required>
            <Input/>
          </FormItem>
        )}
        {watchWorkAuth === 'F1' && (
          <div>
            <p><span className="star">*</span>Please upload your OPT Receipt</p>
            <UploadFile callback={(url) => {
              setOptReceipt(url)
            }}/>
          </div>
        )}
        {
          !citizenStatus && (
            <div>
              <p><span className="star">*</span>Start Date & End Date</p>
              <RangePicker format="YYYY-MM-DD" style={{width: "100%"}} onChange={(_data, text) => {
                setWorkAuthRange(text.toString())
              }}/>
              <div className="ant-form-item-explain-error"
                   style={{color: "#ff4d4f"}}>{workAuthRange ? '' : 'Required'}</div>
            </div>
          )
        }
        <h2>Who referred you to this company</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="reference.firstName" label="First Name" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
          <FormItem control={control} name="reference.lastName" label="Last Name" style={{width: '47%'}} required>
          <Input/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="reference.middleName" label="Middle Name" style={{width: '47%'}}>
            <Input/>
          </FormItem>
          <FormItem control={control} name="reference.relationship" label="Relation" style={{width: '47%'}} required>
            <Input/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="reference.phone" label="Phone" style={{width: '47%'}}>
            <Input/>
          </FormItem>
          <FormItem control={control} name="reference.email" label="Email" style={{width: '47%'}}>
            <Input/>
          </FormItem>
        </Flex>
        <Flex align="center">
          <h2>Emergency contact(s)</h2>
          <Button shape="circle" icon={<PlusOutlined />} style={{margin: "0 20px"}} onClick={() => {
            append({firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: ''});
          }}/>
        </Flex>
        {
          fields.map((item, index) => (
            <div key={item.id}>
              <Flex align="center">
                <p>Contact {index + 1}</p>
                { index > 0 &&
                  <Button shape="circle" size="small" icon={<MinusOutlined /> } style={{margin: "0 20px"}} onClick={() => {
                    remove(index);
                  }}/>
                }
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.firstName`} label="First Name" style={{width: '47%'}} required>
                  <Input/>
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.lastName`} label="Last Name" style={{width: '47%'}} required>
                  <Input/>
                </FormItem>
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.middleName`} label="Middle Name" style={{width: '47%'}}>
                  <Input/>
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.relationship`} label="Relation" style={{width: '47%'}} required>
                  <Input/>
                </FormItem>
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.phone`} label="Phone" style={{width: '47%'}}>
                  <Input/>
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.email`} label="Email" style={{width: '47%'}}>
                  <Input/>
                </FormItem>
              </Flex>
            </div>
          ))
        }
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