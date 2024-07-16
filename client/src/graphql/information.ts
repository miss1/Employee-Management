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