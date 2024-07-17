import {EmergencyFormInfo, OnboardingInformationType} from '../utils/type.ts';
import {FC, useEffect, useState} from 'react';
import {useFieldArray, useForm} from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import {Button, Flex, Form, Input, Card, message} from 'antd';
import {zodResolver} from "@hookform/resolvers/zod";
import {emergencySchema} from "../utils/validation.ts";
import useLoading from "../hooks/useLoading.tsx";
import {useMutation} from "@apollo/client";
import {UPDATE_EMERGENCY_INFO} from "../graphql/information.ts";
import {CloseOutlined, EditOutlined, MinusOutlined} from "@ant-design/icons";

interface propsType {
  data: OnboardingInformationType,
  callback: () => void
}

const EmergencyContactForm: FC<propsType> = ({ data, callback }) => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {emergencyContacts: [{firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: ''}]},
    resolver: zodResolver(emergencySchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emergencyContacts'
  });

  const [editable, setEditable] = useState(false);

  const { showLoading } = useLoading();
  const [updateEmergencyContact] = useMutation(UPDATE_EMERGENCY_INFO);

  useEffect(() => {
    setValue('emergencyContacts', data.emergencyContacts);
  }, [data]);

  const controlBtn = () => {
    if (editable) {
      return <CloseOutlined onClick={() => {
        setEditable(false);
        setValue('emergencyContacts', data.emergencyContacts);
      }}/>
    }
    return <EditOutlined onClick={() => {setEditable(true);}}/>
  };

  const doSubmit = async (params: EmergencyFormInfo) => {
    showLoading(true);
    try {
      await updateEmergencyContact({variables: {input: params}});
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
    <Card title="Emergency contact(s)" extra={controlBtn()} style={{width: 700, marginTop: 20}}>
      <Form layout="vertical" disabled={!editable} style={{width: '600px', margin: '0 auto'}} onFinish={handleSubmit(doSubmit)}>
        <Flex justify="flex-end">
          {editable &&
            <Button type="primary" style={{margin: "0 20px"}} onClick={() => {
              append({firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: ''});
            }}>Add</Button>
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
                  <Input />
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.lastName`} label="Last Name" style={{width: '47%'}} required>
                  <Input />
                </FormItem>
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.middleName`} label="Middle Name" style={{width: '47%'}}>
                  <Input />
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.relationship`} label="Relation" style={{width: '47%'}} required>
                  <Input />
                </FormItem>
              </Flex>
              <Flex justify="space-between">
                <FormItem control={control} name={`emergencyContacts.${index}.phone`} label="Phone" style={{width: '47%'}}>
                  <Input />
                </FormItem>
                <FormItem control={control} name={`emergencyContacts.${index}.email`} label="Email" style={{width: '47%'}}>
                  <Input />
                </FormItem>
              </Flex>
            </div>
          ))
        }
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

export default EmergencyContactForm;