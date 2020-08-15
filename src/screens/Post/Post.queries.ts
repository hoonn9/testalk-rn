import { gql } from "apollo-boost";

export const UPLOAD_POST = gql`
    mutation UploadPost($title: String!, $content: String!, $postPhotos: [PhotoObject!]) {
        UploadPost(title: $title, content: $content, postPhotos: $postPhotos) {
            ok
            error
        }
    }
`;

export const GET_POST = gql`
    query GetPost($id: Int!) {
            GetPost(id: $id) {
                ok
                error
                post {
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
                    comments {
                        id
                        parentId
                        content
                        depth
                        user {
                            id
                            gender
                        }
                        createdAt
                        updatedAt
                    }
                    createdAt
                    updatedAt
                }
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

export const ADD_COMMENT = gql`
    mutation AddComment($postId: Int!, $parentId: Int, $content: String!) {
        AddComment(postId: $postId, parentId: $parentId, content: $content) {
            ok
            error
        }
    }
`;