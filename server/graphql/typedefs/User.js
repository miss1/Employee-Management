const { gql } = require('apollo-server-express');

const user = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    password: String!
    onboarding: String!
    feedback: String!
    information: Information
    documents: Document
    status: Int!
    createdAt: Int
  }
  
  type AuthPayload {
    token: String
    user: User
  }
  
  type Query {
    login(username: String!, password: String!): AuthPayload
  }
  
  type Mutation {
    register(username: String!, password: String!, token: String!): String
  }
`;

module.exports = user;