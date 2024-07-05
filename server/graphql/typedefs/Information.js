const { gql } = require('apollo-server-express');

const information = gql`
  type Person {
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
    reference: Person!
    emergencyContacts: [Person!]
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
    emergencyContacts: [Person!]
  }
  
  type Query {
    information(id: String!): Information
    allInformation(search: String): [Information]
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