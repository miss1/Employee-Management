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
  
  type UnfinishedDocument {
    name: String!
    workAuth: String!
    workAuthStart: String!
    workAuthEnd: String!
    nextStep: Int!
    file: String,
    fileType: String
  }
  
  type Query {
    document: Document
    unfinishedDocument: [UnfinishedDocument]
  }
  
  type Mutation {
    updateDocument(step: Int!, file: String!): String
  }
`;

module.exports = document;