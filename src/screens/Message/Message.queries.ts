import { gql } from "apollo-boost";

export const SUBSCRIBE_MESSAGE = gql`
    subscription MessageSubscription {
        MessageSubscription {
            id
            userId
            chatId
            text
            createdAt
        }
    }
`;

export const GET_CHAT_MESSAGES = gql`
    query GetChatMessages($id: Int!, $requestTime: String) {
        GetChatMessages(chatId: $id, requestTime: $requestTime) {
            ok
            error
            messages {
                id
                userId
                chatId
                text
                createdAt
            }
        }
    } 
`;

export const SEND_MESSAGE = gql`
    mutation SendChatMessage($chatId: Int, $receiveUserId: Int, $text: String!) {
        SendChatMessage(chatId: $chatId, receiveUserId: $receiveUserId, text: $text) {
            ok
            error
            message {
                id
                userId
                chatId
                text
                createdAt
            }
        }
    }
`;