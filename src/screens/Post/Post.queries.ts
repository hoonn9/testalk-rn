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
                    likeCount
                    createdAt
                    updatedAt
                }
                isLiked
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
                createdAt
                readCount
                commentCount
                likeCount
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

export const GET_COMMENT_LIST = gql`
    query GetCommentList($id: Int!, $skip: Int!, $take: Int!, $sort: SortTarget!) {
        GetCommentList(id: $id, skip: $skip, take: $take, sort: $sort) {
            ok
            error
            comments {
                id
                parentId
                content
                depth
                user {
                    id
                    gender
                    nickName
                    birth
                }
                createdAt
                updatedAt
            }
        }
    }
`;


export const TOGGLE_POST_LIKE = gql`
    mutation TogglePostLike($id: Int!) {
        TogglePostLike(id: $id) {
            ok
            error
        }
    }

`;