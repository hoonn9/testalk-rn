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
    mutation CompletePhoneVerification($phoneNumber: String!, $key: String!, $fbId: String, $ggId: String, $kkId: String) {
        CompletePhoneVerification(phoneNumber: $phoneNumber, key: $key,fbId: $fbId, ggId: $ggId, kkId: $kkId) {
            ok
            error
            userId
            token
            isNew
        }
    }
`;