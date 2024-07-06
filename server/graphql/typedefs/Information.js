const { gql } = require('apollo-server-express');

const information = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    middleName: String
    phone: String
    email: String
    relationship: String!
  }
  
  input PersonInput {
    firstName: String!
    lastName: String!
    middleName: String
    phone: String
    email: String
    relationship: String!
  }

  type Information {
    id: ID!
    user: User!
    firstName: String!
    lastName: String!
    middleName: String
    preferredName: String
    picture: String
    addressLine: String!
    city: String!
    state: String!
    postalCode: String!
    cellPhone: String!
    workPhone: String
    email: String!
    ssn: String!
    birthDate: String!
    gender: String!
    workAuth: String!
    workAuthStart: String!
    workAuthEnd: String!
    optReceipt: String
    reference: Person!
    emergencyContacts: [Person!]
    createdAt: Int
  }
  
  input InformationInput {
    firstName: String!
    lastName: String!
    middleName: String
    preferredName: String
    picture: String
    addressLine: String!
    city: String!
    state: String!
    postalCode: String!
    cellPhone: String!
    workPhone: String
    email: String!
    ssn: String!
    birthDate: String!
    gender: String!
    workAuth: String!
    workAuthStart: String!
    workAuthEnd: String!
    optReceipt: String
    reference: ID!
    emergencyContacts: [ID!]
  }
  
  input InformationName {
    firstName: String!
    lastName: String!
    middleName: String
    preferredName: String
    picture: String
    ssn: String!
    birthDate: String!
    gender: String!
  }
  
  input InformationAddress {
    addressLine: String!
    city: String!
    state: String!
    postalCode: String!
  }
  
  input InformationContact {
    cellPhone: String!
    workPhone: String
  }
  
  input InformationEmployment {
    workAuth: String!
    workAuthStart: String!
    workAuthEnd: String!
    optReceipt: String
  }
  
  input InformationEmergencyContact {
    emergencyContacts: [ID!]
  }
  
  type Query {
    information(id: ID!): Information
    allInformation(search: String): [Information]
    visaInformation(workAuth: String!, search: String): [Information]
  }
  
  type Mutation {
    createInformation(input: InformationInput!): String
    updateInformation(input: InformationInput!): String
    updateName(input: InformationName!): Information
    updateAddress(input: InformationAddress!): Information
    updateContact(input: InformationContact!): Information
    updateEmployment(input: InformationEmployment!): Information
    updateEmergencyContact(input: InformationEmergencyContact!): Information
  }
`;

module.exports = information;