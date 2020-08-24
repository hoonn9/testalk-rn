import { gql } from "apollo-boost";

export const UPDATE_LOCATION = gql`
    mutation ReportMovement($lastLat: Float!, $lastLng: Float!) {
        ReportMovement(lastLat: $lastLat, lastLng: $lastLng) {
            ok
            error
        }
    }
`;