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
    onboarding: String!
    feedback: String
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
    workAuthOther: String
    workAuthStart: String
    workAuthEnd: String
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
    workAuthOther: String
    workAuthStart: String
    workAuthEnd: String
    optReceipt: String
    reference: PersonInput!
    emergencyContacts: [PersonInput!]
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
    email: String!
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
    information(id: String!): Information
    userInformation: Information
    allInformation(search: String): [Information]
    applications(onboarding: String): [Information]
    visaInformation(workAuth: String!, search: String): [Information]
  }
  
  type Mutation {
    createInformation(input: InformationInput!): String
    updateInformation(input: InformationInput!): String
    updateName(input: InformationName!): String
    updateAddress(input: InformationAddress!): String
    updateContact(input: InformationContact!): String
    updateEmployment(input: InformationEmployment!): String
    updateEmergencyContact(input: InformationEmergencyContact!): String
    approveApplication(id: String!): String
    rejectApplication(id: String!, feedback: String!): String
  }
`;

module.exports = information;