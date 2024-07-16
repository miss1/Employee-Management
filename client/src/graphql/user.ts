import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!, $email: String!, $token: String!) {
    register(username: $username, password: $password, email: $email, token: $token)
  }
`;