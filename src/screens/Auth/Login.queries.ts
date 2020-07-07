import { gql } from "apollo-boost";

export const GET_CUSTOM_TOKEN = gql`
    query GetCustomToken($means: CustomTokenMeansOptions!, $socialId: String!) {
        GetCustomToken(means: $means, socialId: $socialId) {
            ok
            error
            token
        }
    }
`;