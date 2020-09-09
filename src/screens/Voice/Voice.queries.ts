import { gql } from 'apollo-boost';

export const SUBSCRIBE_VOICE = gql`
    subscription VoiceSubscription {
        VoiceSubscription {
            channelName
            createdAt
        }
    }
`;

export const FIND_VOICE_USER = gql`
    mutation FindVoiceUser($age: Int, $distance: Float, $gender: GenderTarget!) {
        FindVoiceUser(age: $age, distance: $distance, gender: $gender) {
            ok
            error
            channelName
        }
    }
`;

export const REMOVE_VOICE_WAIT = gql`
    mutation RemoveVoiceWait {
        RemoveVoiceWait {
            ok
            error
        }
    }
`;
