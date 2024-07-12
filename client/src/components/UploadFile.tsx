import {FC, useState} from 'react';
import {Button, message, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { storage } from '../utils/firebaseConfig.ts';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from "firebase/storage";
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { useAppSelector } from "../app/hooks.ts";
import type { UploadFile } from 'antd';
import fileIcon from '../assets/pdf_icon.svg';

interface propsType {
  callback: (url: string) => void
}

const UploadFile: FC<propsType> = ({ callback }) => {
  const user = useAppSelector((state) => state.user);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const customRequest = async ({ file }: UploadRequestOption) => {
    const storageRef = ref(storage, `file/${user.username}_OPT`);
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file as Blob);

    uploadTask.on(
      "state_changed",
      () => {
        setFileList([
          {
            uid: '0',
            name: `${user.username}_OPT.pdf`,
            status: 'uploading',
            percent: 33,
          },
        ])
      },
      (error) => {
        console.error(error);
        message.error(`File upload failed: ${error.message}`);
        setFileList([
          {
            uid: '-2',
            name: `${user.username}_OPT.pdf`,
            status: 'error',
            thumbUrl: fileIcon,
          },
        ])
      },
      async () => {
        try {
          const downloadURL: string = await getDownloadURL(uploadTask.snapshot.ref);
          message.success(`File uploaded successfully`);
          console.log(downloadURL);
          setFileList([
            {
              uid: '-1',
              name: `${user.username}_OPT.pdf`,
              status: 'done',
              url: downloadURL,
              thumbUrl: fileIcon,
            }
          ]);
          callback(downloadURL);
        } catch (error: any) {
          message.error(`Failed to get download URL: ${error.message}`);
          setFileList([
            {
              uid: '-2',
              name: `${user.username}_OPT.pdf`,
              status: 'error',
              thumbUrl: fileIcon,
            },
          ])
        }
      }
    );
  };

  const previewFile = () => {
    window.open(fileList[0].url, '_blank');
  };

  const deleteFile = () => {
    setFileList([]);
    callback('');
  };

  return (
    <Upload
      accept=".pdf"
      listType="picture"
      maxCount={1}
      fileList={fileList}
      customRequest={customRequest}
      onPreview={previewFile}
      onRemove={deleteFile}>
      <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
    </Upload>
  );
};

export default UploadFile;