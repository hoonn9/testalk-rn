import { gql } from "apollo-boost";

export const REQUEST_SIGNUP_PHONE_VERIFICATION = gql`
    mutation SignUpStartPhoneVerification($phoneNumber: String!) {
        SignUpStartPhoneVerification(phoneNumber: $phoneNumber) {
            ok
            error
        }
    }
`;

export const CONFIRM_SIGNUP_PHONE_VERIFICATION = gql`
    mutation SignUpCompletePhoneVerification($phoneNumber: String!, $key: String!, $fbId: String, $ggId: String, $kkId: String, $nickName: String!, $gender: String!, $birth: String!) {
        SignUpCompletePhoneVerification(phoneNumber: $phoneNumber, key: $key, fbId: $fbId, ggId: $ggId, kkId: $kkId, nickName: $nickName, gender: $gender, birth: $birth) {
            ok
            error
            userId
            token
        }
    }
`;

export const REQUEST_LOGIN_PHONE_VERIFICATION = gql`
    mutation LoginStartPhoneVerification($phoneNumber: String!) {
        LoginStartPhoneVerification(phoneNumber: $phoneNumber) {
            ok
            error
        }
    }
`;

export const CONFIRM_LOGIN_PHONE_VERIFICATION = gql`
    mutation LoginCompletePhoneVerification($phoneNumber: String!, $key: String!) {
        LoginCompletePhoneVerification(phoneNumber: $phoneNumber, key: $key) {
            ok
            error
            userId
            token
        }
    }
`;