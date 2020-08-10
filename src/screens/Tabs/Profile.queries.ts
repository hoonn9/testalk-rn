import { gql } from "apollo-boost";

export const GET_USER_PROFILE = gql`
    query GetUserProfile($id: Int!) {
        GetUserProfile(id: $id) {
            ok
            error
            user {
                id
                nickName
                birth
                gender
                intro
                updatedAt
                profilePhoto {
                    url
                }
                lastLat
                lastLng
            }
            likeCount
            isLiked
        }
    }
`;

export const TOGGLE_USER_LIKE = gql`
    mutation ToggleUserLike($id: Int!) {
        ToggleUserLike(id: $id) {
            ok
            error
        }
    }

`;