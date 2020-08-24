import { gql } from "apollo-boost";

export const UPDATE_USER_PROFILE = gql`
    mutation UpdateUserProfile($nickName: String!, $intro: String!, $profilePhoto: [PhotoObject!]!) {
        UpdateUserProfile(nickName: $nickName, intro: $intro, profilePhoto: $profilePhoto) {
            ok
            error
        }
    }
`;
