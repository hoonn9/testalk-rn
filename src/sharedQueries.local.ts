import { gql } from "apollo-boost";

export const GET_LOCAL_CHAT_MESSAGES = gql`
  query GetLocalChatMessages($id: Int!) {
    GetLocalChatMessages(id: $id) @client(always: true) {
        __typename
        ok
        error
        messages {
          __typename
          id
          userId
          chatId
          text
          createdAt
        }
    }
  }
`;

export const SET_LOCAL_CHAT_MESSAGES = gql`
  mutation SetLocalChatMessages($id: Int!, $messages: Array) {
    SetLocalChatMessages(id: $id, messages: $messages) @client 
  }
`;

export const INIT_LOCAL_CHAT_MESSAGES = gql`
  mutation InitLocalChatMessages($id: Int!) {
    InitLocalChatMessages(id: $id) @client 
  }
`;