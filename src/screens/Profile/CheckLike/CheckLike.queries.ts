import { gql } from "apollo-boost";

export const GET_LIKE_ME_USER_LIST = gql`
    query GetLikeMeUserList($requestTime: String!, $skip: Int!, $take: Int!) {
        GetLikeMeUserList(requestTime: $requestTime, skip: $skip, take: $take) {
            ok
            error
            likes {
                id
                likeUser {
                    id
                    nickName
                    birth
                    gender
                    intro
                    updatedAt
                    profilePhoto {
                        id
                        url
                    }
                    lastLat
                    lastLng
                }
            }
        }
    }
`;


export const GET_I_LIKE_USER_LIST = gql`
    query GetILikeUserList($skip: Int!, $take: Int!) {
        GetILikeUserList(skip: $skip, take: $take) {
            ok
            error
            likes {
                id
                user {
                    id
                    nickName
                    birth
                    gender
                    intro
                    updatedAt
                    profilePhoto {
                        id
                        url
                    }
                    lastLat
                    lastLng
                }
            }
        }
    }
`;