import {EmploymentFormType, OnboardingInformationType} from '../utils/type.ts';
import {FC, useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import {Button, DatePicker, Form, Input, Card, message, Radio, RadioChangeEvent} from 'antd';
import {zodResolver} from "@hookform/resolvers/zod";
import {employmentSchema} from "../utils/validation.ts";
import useLoading from "../hooks/useLoading.tsx";
import {useMutation} from "@apollo/client";
import {UPDATE_EMPLOYMENT_INFO} from "../graphql/information.ts";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import UploadFile from "./UploadFile.tsx";
import dayjs from "dayjs";

interface propsType {
  data: OnboardingInformationType,
  callback: () => void
}

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

const EmploymentForm: FC<propsType> = ({ data, callback }) => {
  const [optReceipt, setOptReceipt] = useState(data.optReceipt);
  const [citizenStatus, setCitizenStatus] = useState(data.workAuth === 'GreenCard' || data.workAuth === 'Citizen');
  const [workAuthStart, setWorkAuthStart] = useState(data.workAuthStart);
  const [workAuthEnd, setWorkAuthEnd] = useState(data.workAuthEnd);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {workAuth: '', workAuthOther: ''},
    resolver: zodResolver(employmentSchema)
  });

  const watchWorkAuth = watch("workAuth", 'GreenCard');

  const [editable, setEditable] = useState(false);

  const { showLoading } = useLoading();
  const [updateEmployment] = useMutation(UPDATE_EMPLOYMENT_INFO);

  const resetForm = () => {
    setValue('workAuth', data.workAuth);
    setValue('workAuthOther', data.workAuthOther);

    setOptReceipt(data.optReceipt);
    setCitizenStatus(data.workAuth === 'GreenCard' || data.workAuth === 'Citizen');
    setWorkAuthStart(data.workAuthStart);
    setWorkAuthEnd(data.workAuthEnd);
  }

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

  const changeCitizenStatus = (e: RadioChangeEvent) => {
    setCitizenStatus(e.target.value);
    setValue('workAuth', e.target.value ? 'GreenCard' : 'H1-B');
  };

  const doSubmit = async (params: EmploymentFormType) => {
    if (!citizenStatus && workAuthStart === '') return;
    if (params.workAuth === 'F1' && optReceipt === '') return;
    if (params.workAuth === 'Other' && params.workAuthOther === '') return;

    const info = {
      ...params,
      optReceipt: params.workAuth === 'F1' ? optReceipt : '',
      workAuthStart: citizenStatus ? '' : workAuthStart,
      workAuthEnd: citizenStatus ? '' : workAuthEnd
    };

    showLoading(true);
    try {
      await updateEmployment({variables: { input: info }});
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
    <Card title="Employment" extra={controlBtn()} style={{width: 700, marginTop: 20}}>
      <Form layout="vertical" disabled={!editable} style={{width: '600px', margin: '0 auto'}}
            onFinish={handleSubmit(doSubmit)}>
        <div>
          <label>Permanent resident or citizen of the U.S.?</label>
          <Radio.Group disabled={!editable} onChange={changeCitizenStatus} value={citizenStatus}
                       style={{margin: "0 20px"}}>
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
            <Input />
          </FormItem>
        )}
        {watchWorkAuth === 'F1' && (
          <div>
            <p><span className="star">*</span>Please upload your OPT Receipt</p>
            <UploadFile defaultUrl={optReceipt} disabled={!editable} callback={(url) => {
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

export default EmploymentForm;