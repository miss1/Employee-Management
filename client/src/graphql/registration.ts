import { gql } from '@apollo/client';

export const CREATE_REGISTRATION = gql`
  mutation CreateRegistration($name: String!, $email: String!) {
    createRegistration(name: $name, email: $email)
  }
`;

export const GET_REGISTRATIONS = gql`
  query Registrations {
    registrations {
      id,
      email,
      name,
      link,
      submitted
    }
  }
`;