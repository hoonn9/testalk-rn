import { gql } from "apollo-boost";

export const GET_MY_PROFILE = gql`
    query GetMyProfile {
        GetMyProfile {
            ok
            error
            user {
                id
                nickName
                gender
                birth
                intro
                profilePhoto {
                    id
                    url
                    key
                }
                cash
            }
            likeCount
        }
    }
`;