const { gql } = require('apollo-server-express');

const user = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    backupEmail: String!
    role: String!
    password: String!
    createdAt: Int
  }
  
  type AuthPayload {
    token: String
    user: User
  }
  
  type Mutation {
    register(username: String!, password: String!, email: String!, token: String!): String
    login(username: String!, password: String!): AuthPayload
  }
`;

module.exports = user;