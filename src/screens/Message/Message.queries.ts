import { gql } from "apollo-boost";

export const SUBSCRIBE_MESSAGE = gql`
    subscription MessageSubscription($chatId: Int!) {
        MessageSubscription(chatId: $chatId) {
            userId
            text
            target
            createdAt
        }
    }
`;

export const GET_CHAT_USER = gql`
    query GetChatUser($id: Int!) {
        GetChatUser(id: $id) {
            ok
            error
            user {
                id
                nickName
                birth
                profilePhoto {
                    url
                }
                gender
                intro
                updatedAt
                lastLat
                lastLng
            }
        }
    } 
`;

export const SEND_MESSAGE = gql`
    mutation SendChatMessage($chatId: Int, $receiveUserId: Int, $text: String!, $sendTime: String!) {
        SendChatMessage(chatId: $chatId, receiveUserId: $receiveUserId, text: $text, sendTime: $sendTime) {
            ok
            error
            chatId
        }
    }
`;

export const LEAVE_CHAT = gql`
    mutation LeaveChat($id: Int!) {
        LeaveChat(id: $id) {
            ok
            error
        }
    }
`;