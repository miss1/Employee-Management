import { FC, useEffect, useState } from 'react';
import { useFieldArray, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import dayjs from 'dayjs';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Flex, Input, message, DatePicker, Radio, RadioChangeEvent } from "antd";
import useLoading from '../hooks/useLoading.tsx';
import { addOnboardingSchema } from '../utils/validation.ts';
import { OnboardingFormType, OnboardingInformationType } from '../utils/type.ts';
import UploadImage from './UploadImage.tsx';
import UploadFile from './UploadFile.tsx';
import { useAppSelector, useAppDispatch } from "../app/hooks.ts";
import { updateVisaStatus } from '../app/slice/notification.ts';
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_INFO, UPDATE_INFO, USER_INFO } from '../graphql/information.ts';
import { useNavigate } from 'react-router-dom';

interface propsType {
  callback: (step: number, msg: string) => void
}

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

const OnboardingForm: FC<propsType> = ({ callback }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const [editable, setEditable] = useState(true);

  const [picture, setPicture] = useState('');
  const [optReceipt, setOptReceipt] = useState('');
  const [citizenStatus, setCitizenStatus] = useState(true);
  const [workAuthStart, setWorkAuthStart] = useState('');
  const [workAuthEnd, setWorkAuthEnd] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      firstName: '', lastName: '', middleName: '', preferredName: '',
      addressLine: '', city: '', state: '', postalCode: '', cellPhone: '', workPhone: '', email: user.email, ssn: '',
      gender: 'None', workAuth: 'GreenCard', workAuthOther: '',
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

  const { showLoading } = useLoading();
  const [createInformation] = useMutation(CREATE_INFO);
  const [updateInformation] = useMutation(UPDATE_INFO);
  const { loading, error, data: formData } = useQuery(USER_INFO);

  if (loading) showLoading(true);
  if (error) {
    message.error(error.message);
    showLoading(false);
  }

  useEffect(() => {
    showLoading(false);
    if (formData && formData.userInformation) {
      if (formData.userInformation.onboarding === 'approved') {
        navigate('/employee');
        return;
      }

      if (formData.userInformation.onboarding === 'pending') {
        callback(1, '');
        setEditable(false);
      } else {
        callback(2, formData.userInformation.feedback);
        setEditable(true);
      }

      setValue('firstName', formData.userInformation.firstName);
      setValue('lastName', formData.userInformation.lastName);
      setValue('middleName', formData.userInformation.middleName);
      setValue('preferredName', formData.userInformation.preferredName);
      setValue('addressLine', formData.userInformation.addressLine);
      setValue('city', formData.userInformation.city);
      setValue('state', formData.userInformation.state);
      setValue('postalCode', formData.userInformation.postalCode);
      setValue('cellPhone', formData.userInformation.cellPhone);
      setValue('workPhone', formData.userInformation.workPhone);
      setValue('email', formData.userInformation.email);
      setValue('ssn', formData.userInformation.ssn);
      setValue('gender', formData.userInformation.gender);
      setValue('workAuth', formData.userInformation.workAuth);
      setValue('workAuthOther', formData.userInformation.workAuthOther);
      setValue('reference', formData.userInformation.reference);
      setValue('emergencyContacts', formData.userInformation.emergencyContacts);

      setPicture(formData.userInformation.picture);
      setOptReceipt(formData.userInformation.optReceipt);
      setCitizenStatus(formData.userInformation.workAuth === 'GreenCard' || formData.userInformation.workAuth === 'Citizen');
      setWorkAuthStart(formData.userInformation.workAuthStart);
      setWorkAuthEnd(formData.userInformation.workAuthEnd);
      setBirthDate(formData.userInformation.birthDate);

      dispatch(updateVisaStatus(formData.userInformation.workAuth));
    }
  }, [formData, setValue]);

  const changeCitizenStatus = (e: RadioChangeEvent) => {
    setCitizenStatus(e.target.value);
    setValue('workAuth', e.target.value ? 'GreenCard' : 'H1-B');
  };

  const doSubmit = async (params: OnboardingFormType) => {
    if (birthDate === '') return;
    if (!citizenStatus && workAuthStart === '') return;
    if (params.workAuth === 'F1' && optReceipt === '') return;

    const info: OnboardingInformationType = {
      ...params,
      birthDate: birthDate,
      picture: picture,
      optReceipt: params.workAuth === 'F1' ? optReceipt : '',
      workAuthStart: citizenStatus ? '' : workAuthStart,
      workAuthEnd: citizenStatus ? '' : workAuthEnd
    }

    showLoading(true);
    try {
      if (formData && formData.userInformation) {
        const { data } = await updateInformation({variables: {input: info}});
        message.success(data.updateInformation);
      } else {
        const { data } = await createInformation({variables: {input: info}});
        message.success(data.createInformation);
      }
      callback(1, '');
      setEditable(false);
    } catch (e) {
      console.error(String(e));
      message.error(String(e));
    } finally {
      showLoading(false);
    }
  };

  return (
    <>
      <Form layout="vertical" style={{width: '600px', margin: '0 auto'}} onFinish={handleSubmit(doSubmit)}>
        <h2>Name</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="firstName" label="First Name" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="lastName" label="Last Name" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="middleName" label="Middle Name" style={{width: '47%'}}>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="preferredName" label="Preferred Name" style={{width: '47%'}}>
            <Input disabled={!editable}/>
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
            <Input disabled={!editable}/>
          </FormItem>
          <div style={{width: "47%"}}>
            <p style={{margin: 0, paddingBottom: "8px"}}><span className="star">*</span>Birth Date</p>
            <DatePicker disabled={!editable} value={birthDate && dayjs(birthDate, dateFormat)} format={dateFormat} style={{width: "100%"}} onChange={(_data, text) => {
              setBirthDate(String(text));
            }}/>
            <div className="ant-form-item-explain-error"
                 style={{color: "#ff4d4f"}}>{birthDate ? '' : 'Required'}</div>
          </div>
        </Flex>
        <FormItem control={control} name="gender" label="Gender" required>
          <Radio.Group disabled={!editable}>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="None">Do not wish to answer</Radio>
          </Radio.Group>
        </FormItem>
        <h2>Address</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="addressLine" label="Address Line 1" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="city" label="City" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="state" label="State" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="postalCode" label="Postal Code" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
        </Flex>
        <h2>Contact Info</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="cellPhone" label="Cell Phone" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="workPhone" label="Work Phone" style={{width: '47%'}}>
            <Input disabled={!editable}/>
          </FormItem>
        </Flex>
        <h2>Employment</h2>
        <div>
          <label>Permanent resident or citizen of the U.S.?</label>
          <Radio.Group disabled={!editable} onChange={changeCitizenStatus} value={citizenStatus} style={{margin: "0 20px"}}>
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </div>
        {
          citizenStatus
            ? (
              <FormItem control={control} name="workAuth" label="Status" required>
                <Radio.Group disabled={!editable}>
                  <Radio value="GreenCard">Green Card</Radio>
                  <Radio value="Citizen">Citizen</Radio>
                </Radio.Group>
              </FormItem>
            )
            : (
              <FormItem control={control} name="workAuth" label="What is your work authorization?" required>
                <Radio.Group disabled={!editable}>
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
            <Input disabled={!editable}/>
          </FormItem>
        )}
        {watchWorkAuth === 'F1' && (
          <div>
            <p><span className="star">*</span>Please upload your OPT Receipt</p>
            <UploadFile defaultUrl={optReceipt} disabled={!editable} fileName="OPT" callback={(url) => {
              setOptReceipt(url)
            }}/>
          </div>
        )}
        {
          !citizenStatus && (
            <div>
              <p><span className="star">*</span>Start Date & End Date</p>
              <RangePicker
                disabled={[!editable, !editable]}
                value={workAuthStart && workAuthEnd ? [dayjs(workAuthStart, dateFormat), dayjs(workAuthEnd, dateFormat)] : [null, null]}
                format={dateFormat} style={{width: "100%"}}
                onChange={(_data, text) => {
                  setWorkAuthStart(text[0]);
                  setWorkAuthEnd(text[1]);
              }}/>
              <div className="ant-form-item-explain-error"
                   style={{color: "#ff4d4f"}}>{workAuthStart ? '' : 'Required'}</div>
            </div>
          )
        }
        <h2>Who referred you to this company</h2>
        <Flex justify="space-between">
          <FormItem control={control} name="reference.firstName" label="First Name" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="reference.lastName" label="Last Name" style={{width: '47%'}} required>
          <Input disabled={!editable}/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="reference.middleName" label="Middle Name" style={{width: '47%'}}>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="reference.relationship" label="Relation" style={{width: '47%'}} required>
            <Input disabled={!editable}/>
          </FormItem>
        </Flex>
        <Flex justify="space-between">
          <FormItem control={control} name="reference.phone" label="Phone" style={{width: '47%'}}>
            <Input disabled={!editable}/>
          </FormItem>
          <FormItem control={control} name="reference.email" label="Email" style={{width: '47%'}}>
            <Input disabled={!editable}/>
          </FormItem>
        </Flex>
        <Flex align="center">
          <h2>Emergency contact(s)</h2>
          {editable &&
            <Button shape="circle" icon={<PlusOutlined />} style={{margin: "0 20px"}} onClick={() => {
              append({firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: ''});
            }}/>
          }
        </Flex>
        {
          fields.map((item, index) => (
            <div key={item.id}>
              <Flex align="center">
                <p>Contact {index + 1}</p>
                { index > 0 && editable &&
                  <Button shape="circle" size="small" icon={<MinusOutlined /> } style={{margin: "0 20px"}} onClick={() => {
                    remove(index);
                  }}/>
                }
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.firstName`} label="First Name" style={{width: '47%'}} required>
                  <Input disabled={!editable}/>
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.lastName`} label="Last Name" style={{width: '47%'}} required>
                  <Input disabled={!editable}/>
                </FormItem>
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.middleName`} label="Middle Name" style={{width: '47%'}}>
                  <Input disabled={!editable}/>
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.relationship`} label="Relation" style={{width: '47%'}} required>
                  <Input disabled={!editable}/>
                </FormItem>
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.phone`} label="Phone" style={{width: '47%'}}>
                  <Input disabled={!editable}/>
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.email`} label="Email" style={{width: '47%'}}>
                  <Input disabled={!editable}/>
                </FormItem>
              </Flex>
            </div>
          ))
        }
        <Form.Item style={{marginTop: 30}}>
          <Button disabled={!editable} type="primary" htmlType="submit" style={{width: '100%'}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default OnboardingForm;