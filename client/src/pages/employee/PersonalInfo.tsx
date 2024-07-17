import NameForm from '../../components/NameForm';
import AddressForm from '../../components/AddressForm';
import ContactForm from '../../components/ContactForm';
import EmploymentForm from '../../components/EmploymentForm';
import EmergencyContactForm from '../../components/EmergencyContactForm';
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
      <AddressForm data={data.userInformation} callback={refreshPage}/>
      <ContactForm data={data.userInformation} callback={refreshPage}/>
      <EmploymentForm data={data.userInformation} callback={refreshPage}/>
      <EmergencyContactForm data={data.userInformation} callback={refreshPage}/>
    </div>
  );
};

export default PersonalInfo;