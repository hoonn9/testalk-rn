import { gql } from "apollo-boost";

export const UPLOAD_POST = gql`
    mutation UploadPost($title: String!, $content: String!, $postPhotos: [PhotoObject!]) {
        UploadPost(title: $title, content: $content, postPhotos: $postPhotos) {
            ok
            error
        }
    }
`;

export const GET_POST_LIST = gql`
    query GetPostList($requestTime: String!, $means: String!, $skip: Int!, $take: Int!) {
        GetPostList(requestTime: $requestTime, means: $means, skip: $skip, take: $take) {
            ok
            error
            posts {
                id
                title
                content
                user {
                    id
                    nickName
                    birth
                    gender
                    profilePhoto {
                        id
                        url
                    }
                }
                files {
                    id
                    url
                }
                updatedAt
            }
        }
    }
`;