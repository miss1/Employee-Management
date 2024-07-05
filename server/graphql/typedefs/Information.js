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
`;

module.exports = information;