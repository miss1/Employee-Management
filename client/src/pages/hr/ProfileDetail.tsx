import { useParams } from "react-router-dom";
import { Card, message, Flex, Image } from 'antd';
import { useQuery } from '@apollo/client';
import {INFORMATION} from '../../graphql/information';
import { FilePdfOutlined } from '@ant-design/icons';
import {useAppSelector} from "../../app/hooks.ts";
import { ContactType } from '../../utils/type.ts';

const ProfileDetail = () => {
  const id = useParams().id || "";
  const user = useAppSelector((state) => state.user);

  const { loading, error, data } = useQuery(INFORMATION, {
    variables: { id },
  });

  if (error) message.error(String(error));
  if (loading) return <h2>Loading...</h2>

  return (
    <>
      <div className="scrollPage">
        <Card title="Name" style={{width: 700}}>
          <div style={{margin: "0 auto"}}>
            <Flex vertical justify="center" align="center">
              <Image src={data.information.picture} width={150}/>
            </Flex>
            <Flex justify="space-around">
              <p>First Name: {data.information.firstName}</p>
              <p>Last Name: {data.information.lastName}</p>
              <p>Middle Name: {data.information.middleName}</p>
            </Flex>
            <Flex justify="space-around">
              <p>Preferred Name: {data.information.preferredName}</p>
              <p>Gender: {data.information.gender}</p>
              <p>Email: {data.information.email}</p>
            </Flex>
            <Flex justify="space-around">
              <p>SSN: {data.information.ssn}</p>
              <p>Birth Date: {data.information.birthDate}</p>
            </Flex>
          </div>
        </Card>
        <Card title="Address" style={{width: 700, marginTop: 15}}>
          <div style={{margin: "0 auto"}}>
            <p>Address Line 1: {data.information.addressLine}</p>
            <Flex justify="space-around">
              <p>City: {data.information.city}</p>
              <p>State: {data.information.state}</p>
              <p>Postal Code: {data.information.postalCode}</p>
            </Flex>
          </div>
        </Card>
        <Card title="Contact Info" style={{width: 700, marginTop: 15}}>
          <div style={{margin: "0 auto"}}>
            <Flex justify="space-around">
              <p>Cell Phone: {data.information.cellPhone}</p>
              <p>Work Phone: {data.information.workPhone}</p>
            </Flex>
          </div>
        </Card>
        <Card title="Employment" style={{width: 700, marginTop: 15}}>
          <div style={{margin: "0 auto"}}>
            <Flex justify="space-around">
              <p>Visa
                Title: {data.information.workAuth === 'Other' ? data.information.workAuthOther : data.information.workAuth}</p>
              <p>Start Date: {data.information.workAuthStart}</p>
              <p>End Date: {data.information.workAuthEnd}</p>
            </Flex>
            {data.information.optReceipt &&
              <p>OPT Receipt:
                <a target="_blank" href={data.information.optReceipt}>
                  <FilePdfOutlined/>
                  {user.username}_OPT.pdf
                </a>
              </p>
            }
          </div>
        </Card>
        <Card title="Who referred you" style={{width: 700, marginTop: 15}}>
          <Flex justify="space-around">
            <p>First Name: {data.information.reference.firstName}</p>
            <p>Last Name: {data.information.reference.lastName}</p>
            <p>Middle Name: {data.information.reference.middleName}</p>
          </Flex>
          <Flex justify="space-around">
            <p>Phone: {data.information.reference.phone}</p>
            <p>Email: {data.information.reference.email}</p>
            <p>Relation: {data.information.reference.relationship}</p>
          </Flex>
        </Card>
        <Card title="Emergency contact(s)" style={{width: 700, marginTop: 15}}>
          {
            data.information.emergencyContacts.map((item: ContactType, idx: number) => (
              <div key={idx}>
                <h3>Contact {idx + 1}</h3>
                <Flex justify="space-around">
                  <p>First Name: {item.firstName}</p>
                  <p>Last Name: {item.lastName}</p>
                  <p>Middle Name: {item.middleName}</p>
                </Flex>
                <Flex justify="space-around">
                  <p>Phone: {item.phone}</p>
                  <p>Email: {item.email}</p>
                  <p>Relation: {item.relationship}</p>
                </Flex>
              </div>
            ))
          }
        </Card>
      </div>
    </>
  );
};

export default ProfileDetail;