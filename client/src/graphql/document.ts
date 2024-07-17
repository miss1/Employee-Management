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

export const UNFINISHED_DOCUMENTS = gql`
  query unfinishedDocument {
    unfinishedDocument {
      id,
      name,
      workAuth,
      workAuthStart,
      workAuthEnd,
      nextStep,
      file,
      fileType
    }
  }
`

export const APPROVE_DOCUMENT = gql`
  mutation ApproveDocument($id: String!) {
    approveDocument(id: $id)
  }
`;

export const REJECT_DOCUMENT = gql`
  mutation rejectDocument($id: String!, $feedback: String!) {
    rejectDocument(id: $id, feedback: $feedback)
  }
`;