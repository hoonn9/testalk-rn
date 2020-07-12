import { gql } from "apollo-boost";

export const GET_USER_PROFILE = gql`
    query GetUserProfile($id: Int!) {
        GetUserProfile(id: $id) {
            ok
            error
            user {
                id
                nickName
                gender
                birth
                phoneNumber
            }
        }
    }
`;