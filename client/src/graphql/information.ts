import { gql } from '@apollo/client';

export const CREATE_INFO = gql`
  mutation CreateInformation($input: InformationInput!) {
    createInformation(input: $input)
  }
`;

export const UPDATE_INFO = gql`
  mutation UpdateInformation($input: InformationInput!) {
    updateInformation(input: $input)
  }
`;

export const UPDATE_NAME_INFO = gql`
  mutation UpdateName($input: InformationName!) {
    updateName(input: $input)
  }
`;

export const UPDATE_ADDRESS_INFO = gql`
  mutation UpdateAddress($input: InformationAddress!) {
    updateAddress(input: $input)
  }
`;

export const UPDATE_Contact_INFO = gql`
  mutation UpdateContact($input: InformationContact!) {
    updateContact(input: $input)
  }
`;

export const UPDATE_EMPLOYMENT_INFO = gql`
  mutation UpdateEmployment($input: InformationEmployment!) {
    updateEmployment(input: $input)
  }
`;

export const USER_INFO = gql`
  query UserInformation {
    userInformation {
      onboarding,
      feedback,
      firstName,
      lastName,
      middleName,
      preferredName,
      picture,
      addressLine,
      city,
      state,
      postalCode,
      cellPhone,
      workPhone,
      email,
      ssn,
      birthDate,
      gender,
      workAuth,
      workAuthOther,
      workAuthStart,
      workAuthEnd,
      optReceipt,
      reference {
        firstName,
        lastName,
        middleName,
        phone,
        email,
        relationship
      },
      emergencyContacts {
        firstName,
        lastName,
        middleName,
        phone,
        email,
        relationship
      }
    }
  }
`;

export const APPLICATIONS = gql`
  query Applications($onboarding: String!) {
    applications(onboarding: $onboarding) {
      id,
      firstName,
      lastName,
      email
    }
  }
`

export const INFORMATION = gql`
  query Information($id: String!) {
    information(id: $id) {
      onboarding,
      firstName,
      lastName,
      middleName,
      preferredName,
      picture,
      addressLine,
      city,
      state,
      postalCode,
      cellPhone,
      workPhone,
      email,
      ssn,
      birthDate,
      gender,
      workAuth,
      workAuthOther,
      workAuthStart,
      workAuthEnd,
      optReceipt,
      reference {
        firstName,
        lastName,
        middleName,
        phone,
        email,
        relationship
      },
      emergencyContacts {
        firstName,
        lastName,
        middleName,
        phone,
        email,
        relationship
      }
    }
  }
`

export const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($id: String!) {
    approveApplication(id: $id)
  }
`;

export const REJECT_APPLICATION = gql`
  mutation RejectApplication($id: String!, $feedback: String!) {
    rejectApplication(id: $id, feedback: $feedback)
  }
`;