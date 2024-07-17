import style from './visa.module.css';
import {CheckCircleOutlined, CloseCircleOutlined, FilePdfOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {Button, Flex, message} from "antd";
import {useAppSelector} from "../../app/hooks.ts";
import UploadFile from '../../components/UploadFile.tsx';
import { USER_DOCUMENT, UPDATE_DOCUMENT } from '../../graphql/document.ts';
import { useQuery, useMutation } from '@apollo/client';
import useLoading from "../../hooks/useLoading.tsx";

const fileRequired = [
  {name: 'OPT Receipt', pending: 'Waiting for HR to approve your OPT Receipt', approved: 'Please upload a copy of your OPT EAD'},
  {name: 'OPT EAD', pending: 'Waiting for HR to approve your OPT EAD', approved: 'Please download and fill out the I-983 form'},
  {name: 'I-983', pending: 'Waiting for HR to approve and sign your I-983', approved: 'Please send the I-983 along with all necessary documents to your school and upload the new I-20”'},
  {name: 'I-20', pending: 'Waiting for HR to approve your I-20', approved: 'All documents have been approved'},
];

const VisaStatus = () => {
  const user = useAppSelector((state) => state.user);

  const { showLoading } = useLoading();
  const [updateDocument] = useMutation(UPDATE_DOCUMENT);

  const { loading, error, data, refetch } = useQuery(USER_DOCUMENT, );

  if (error) message.error(String(error));
  if (loading) return <div className="loadingPage"><h2>Loading...</h2></div>

  const getIcon = (idx: number) => {
    if (data.document.step > idx) return <CheckCircleOutlined style={{fontSize: 36, color: "#1677ff"}}/>;
    if (data.document.status === 'approved') return <CheckCircleOutlined style={{fontSize: 36, color: "#1677ff"}}/>;
    if (data.document.status === 'pending') return <InfoCircleOutlined style={{fontSize: 36, color: "#666"}}/>
    return <CloseCircleOutlined style={{fontSize: 36, color: "#ff4d4f"}}/>;
  };

  const getFeedback = (idx: number) => {
    if (data.document.step > idx) return '';
    if (data.document.status === 'rejected') return <p className={`${style.feedback} failed`}>{data.document.feedback}</p>;
    else if (data.document.status === 'approved') return <p className={`${style.feedback} success`}>{fileRequired[idx - 1].approved}</p>;
    else return <p className={style.feedback}>{fileRequired[idx - 1].pending}</p>;
  };

  const showUploadBtn = (idx: number) => {
    return (data.document.step === idx && data.document.status === 'approved') || (data.document.step === idx + 1 && data.document.status === 'rejected');
  };

  const doSubmitDocument = async (url: string) => {
    showLoading(true);
    try {
      const step = data.document.status === 'rejected' ? data.document.step : data.document.step + 1;
      await updateDocument({variables: {step: step, file: url}});
      message.success("Update successfully");
      refetch().then();
    } catch (e) {
      console.error(String(e));
      message.error(String(e));
    } finally {
      showLoading(false);
    }
  };

  return (
    <div className="content" style={{overflowY: "auto",}}>
      <div style={{width: 700, height: "100%", margin: "0 auto"}}>
        <div style={{padding: "20px 0"}}>
          {
            data.document.step >= 1 &&
            <div className={style.section}>
              <Flex align="center">
                {getIcon(1)}
                <p className={style.section_title}>OPT Receipt</p>
              </Flex>
              <a target="_blank" className={style.file} href={data.document.optReceipt}>
                <FilePdfOutlined style={{fontSize: 18, margin: "0 5px"}}/>
                <span>{user.username}_OPT.pdf</span>
              </a>
              {getFeedback(1)}
              {
                showUploadBtn(1) &&
                <UploadFile defaultUrl='' disabled={false} fileName="EAD" callback={(url) => {
                  doSubmitDocument(url);
                }}/>
              }
            </div>
          }

          {
            data.document.step >= 2 &&
            (
              <>
                <div className={style.line}></div>
                <div className={style.section}>
                  <Flex align="center">
                    {getIcon(2)}
                    <p className={style.section_title}>OPT EAD</p>
                  </Flex>
                  <a target="_blank" className={style.file} href={data.document.optEAD}>
                    <FilePdfOutlined style={{fontSize: 18, margin: "0 5px"}}/>
                    <span>{user.username}_EAD.pdf</span>
                  </a>
                  {getFeedback(2)}
                  {
                    showUploadBtn(2) &&
                    <>
                      <Flex style={{margin: "10px 0"}}>
                        <Button>Empty Template</Button>
                        <div style={{width: 10}}></div>
                        <Button>Sample Template</Button>
                      </Flex>
                      <UploadFile defaultUrl='' disabled={false} fileName="I983" callback={(url) => {
                        doSubmitDocument(url);
                      }}/>
                    </>
                  }
                </div>
              </>
            )
          }

          {
            data.document.step >= 3 &&
            (
              <>
                <div className={style.line}></div>
                <div className={style.section}>
                  <Flex align="center">
                    {getIcon(3)}
                    <p className={style.section_title}>I-983</p>
                  </Flex>
                  <a target="_blank" className={style.file} href={data.document.i983}>
                    <FilePdfOutlined style={{fontSize: 18, margin: "0 5px"}}/>
                    <span>{user.username}_I983.pdf</span>
                  </a>
                  {getFeedback(3)}
                  {
                    showUploadBtn(3) &&
                    <UploadFile defaultUrl='' disabled={false} fileName="I20" callback={(url) => {
                      doSubmitDocument(url);
                    }}/>
                  }
                </div>
              </>
            )
          }

          {
            data.document.step >= 4 &&
            (
              <>
                <div className={style.line}></div>
                <div className={style.section}>
                  <Flex align="center">
                    {getIcon(4)}
                    <p className={style.section_title}>I-20</p>
                  </Flex>
                  <a target="_blank" className={style.file} href={data.document.i20}>
                    <FilePdfOutlined style={{fontSize: 18, margin: "0 5px"}}/>
                    <span>{user.username}_I20.pdf</span>
                  </a>
                  {getFeedback(4)}
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default VisaStatus;