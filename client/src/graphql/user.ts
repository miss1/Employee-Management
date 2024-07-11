import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token,
      user {
        username,
        onboarding,
        information {
          id
        },
        documents {
          id
        }
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!, $token: String!) {
    register(username: $username, password: $password, token: $token)
  }
`;