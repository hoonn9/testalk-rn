import { gql } from "apollo-boost";

export const REQUEST_PHONE_VERIFICATION = gql`
    mutation StartPhoneVerification($phoneNumber: String!) {
        StartPhoneVerification(phoneNumber: $phoneNumber) {
            ok
            error
        }
    }
`;

export const CONFIRM_PHONE_VERIFICATION = gql`
    mutation CompletePhoneVerification($phoneNumber: String!, $key: String!, $nickName: String!, $gender: String!, $birth: String!, $fbId: String, $ggId: String) {
        CompletePhoneVerification(phoneNumber: $phoneNumber, key: $key, nickName: $nickName, gender: $gender, birth: $birth, fbId: $fbId, ggId: $ggId) {
            ok
            error
            userId
            token
        }
    }
`;