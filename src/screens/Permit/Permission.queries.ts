import { gql } from 'apollo-boost';

export const SET_USER_NOTIFY = gql`
  mutation SetUserNotify($token: String!) {
    SetUserNotify(token: $token) {
      ok
      error
    }
  }
`;
