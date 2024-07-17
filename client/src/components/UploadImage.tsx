import {FC, useEffect, useState} from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { storage } from '../utils/firebaseConfig.ts';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from "firebase/storage";
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useAppSelector } from "../app/hooks.ts";

interface propsType {
  callback: (url: string) => void,
  disable: boolean,
  defaultUrl: string,
}

const UploadImage: FC<propsType> = ({ callback, disable, defaultUrl }) => {
  const user = useAppSelector((state) => state.user);
  const [fileUrl, setFileUrl] = useState(defaultUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFileUrl(defaultUrl);
  }, [defaultUrl]);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const customRequest = async ({ file }: UploadRequestOption) => {
    const storageRef = ref(storage, `avatar/${user.username}`);
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file as Blob);

    uploadTask.on(
      "state_changed",
      () => {
        setLoading(true);
      },
      (error) => {
        console.error(error);
        message.error(`Image upload failed: ${error.message}`);
        setLoading(false);
      },
      async () => {
        try {
          const downloadURL: string = await getDownloadURL(uploadTask.snapshot.ref);
          message.success(`image uploaded successfully`);
          setFileUrl(downloadURL);
          callback(downloadURL);
        } catch (error: any) {
          message.error(`Failed to get download URL: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  return (
    <Upload
      name="avatar"
      accept="image/*"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={customRequest}
      disabled={disable}>
      {fileUrl ? <img src={fileUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default UploadImage;