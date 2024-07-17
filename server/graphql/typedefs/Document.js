const { gql } = require('apollo-server-express');

const document = gql`
  type Document {
    id: ID!
    user: User!
    step: Int!
    status: String!
    feedback: String
    optReceipt: String!
    optEAD: String
    i983: String
    i20: String
    createdAt: Int
  }
  
  type Query {
    document: Document
  }
  
  type Mutation {
    updateDocument(step: Int!, file: String!): String
  }
`;

module.exports = document;