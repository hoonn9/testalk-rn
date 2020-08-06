import { gql } from "apollo-boost";

export const UPDATE_LOCATION = gql`
    mutation ReportMovement($lastLat: Float!, $lastLng: Float!) {
        ReportMovement(lastLat: $lastLat, lastLng: $lastLng) {
            ok
            error
        }
    }
`;

export const GET_USER_LIST = gql`
    query GetUserList($requestTime: String!, $means: String!, $skip: Int!, $take: Int!) {
        GetUserList(requestTime: $requestTime, means: $means, skip: $skip, take: $take) {
            ok
            error
            users {
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
`;