import NameForm from '../../components/NameForm';
import { useQuery } from '@apollo/client';
import { USER_INFO } from '../../graphql/information';
import { message } from "antd";

const PersonalInfo = () => {

  const { loading, error, data, refetch } = useQuery(USER_INFO);

  if (error) message.error(String(error));
  if (loading) return <div className="loadingPage"><h2>Loading...</h2></div>

  const refreshPage = () => {
    refetch().then();
  };

  return (
    <div className="scrollPage">
      <NameForm data={data.userInformation} callback={refreshPage}/>
    </div>
  );
};

export default PersonalInfo;