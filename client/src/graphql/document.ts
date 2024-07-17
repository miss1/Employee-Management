import { gql } from '@apollo/client';

export const USER_DOCUMENT = gql`
  query document {
    document {
      step,
      status,
      feedback,
      optReceipt,
      optEAD,
      i983,
      i20
    }
  }
`
export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($step: Int!, $file: String!) {
    updateDocument(step: $step, file: $file)
  }
`;