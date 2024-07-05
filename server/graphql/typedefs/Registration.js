const { gql } = require('apollo-server-express');

const registration = gql`
  type Registration {
    id: ID!
    name: String!
    email: String!
    token: String!
    link: String!
    submitted: Boolean
    createdAt: String
    expiresAt: String!
  }
  
  type Query {
    registration(token: String!): Registration
    registrations: [Registration]
  }
  
  type Mutation {
    createRegistration(name: String!, email: String!): String
  }
`;

module.exports = registration;