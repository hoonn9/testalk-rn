/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCustomToken
// ====================================================

export interface GetCustomToken_GetCustomToken {
  __typename: "GetCustomTokenResponse";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface GetCustomToken {
  GetCustomToken: GetCustomToken_GetCustomToken;
}

export interface GetCustomTokenVariables {
  means: CustomTokenMeansOptions;
  socialId: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignUpStartPhoneVerification
// ====================================================

export interface SignUpStartPhoneVerification_SignUpStartPhoneVerification {
  __typename: "SignUpStartPhoneVerificationResponse";
  ok: boolean;
  error: string | null;
}

export interface SignUpStartPhoneVerification {
  SignUpStartPhoneVerification: SignUpStartPhoneVerification_SignUpStartPhoneVerification;
}

export interface SignUpStartPhoneVerificationVariables {
  phoneNumber: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignUpCompletePhoneVerification
// ====================================================

export interface SignUpCompletePhoneVerification_SignUpCompletePhoneVerification {
  __typename: "SignUpCompletePhoneVerificationResponse";
  ok: boolean;
  error: string | null;
  userId: number | null;
  token: string | null;
}

export interface SignUpCompletePhoneVerification {
  SignUpCompletePhoneVerification: SignUpCompletePhoneVerification_SignUpCompletePhoneVerification;
}

export interface SignUpCompletePhoneVerificationVariables {
  phoneNumber: string;
  key: string;
  fbId?: string | null;
  ggId?: string | null;
  kkId?: string | null;
  nickName: string;
  gender: string;
  birth: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginStartPhoneVerification
// ====================================================

export interface LoginStartPhoneVerification_LoginStartPhoneVerification {
  __typename: "LoginStartPhoneVerificationResponse";
  ok: boolean;
  error: string | null;
}

export interface LoginStartPhoneVerification {
  LoginStartPhoneVerification: LoginStartPhoneVerification_LoginStartPhoneVerification | null;
}

export interface LoginStartPhoneVerificationVariables {
  phoneNumber: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginCompletePhoneVerification
// ====================================================

export interface LoginCompletePhoneVerification_LoginCompletePhoneVerification {
  __typename: "LoginCompletePhoneVerificationResponse";
  ok: boolean;
  error: string | null;
  userId: number | null;
  token: string | null;
}

export interface LoginCompletePhoneVerification {
  LoginCompletePhoneVerification: LoginCompletePhoneVerification_LoginCompletePhoneVerification;
}

export interface LoginCompletePhoneVerificationVariables {
  phoneNumber: string;
  key: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserList
// ====================================================

export interface GetUserList_GetUserList_users_profilePhoto {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetUserList_GetUserList_users {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  intro: string;
  updatedAt: string | null;
  profilePhoto: GetUserList_GetUserList_users_profilePhoto[] | null;
  lastLat: number | null;
  lastLng: number | null;
}

export interface GetUserList_GetUserList {
  __typename: "GetUserListResponse";
  ok: boolean;
  error: string | null;
  users: (GetUserList_GetUserList_users | null)[] | null;
  order: (number | null)[] | null;
}

export interface GetUserList {
  GetUserList: GetUserList_GetUserList;
}

export interface GetUserListVariables {
  requestTime: string;
  means: GetUserListMeans;
  skip: number;
  take: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UploadPost
// ====================================================

export interface UploadPost_UploadPost {
  __typename: "UploadPostResponse";
  ok: boolean;
  error: string | null;
}

export interface UploadPost {
  UploadPost: UploadPost_UploadPost | null;
}

export interface UploadPostVariables {
  title: string;
  content: string;
  postPhotos?: PhotoObject[] | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPost
// ====================================================

export interface GetPost_GetPost_post_user_profilePhoto {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetPost_GetPost_post_user {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  profilePhoto: GetPost_GetPost_post_user_profilePhoto[] | null;
}

export interface GetPost_GetPost_post_files {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetPost_GetPost_post {
  __typename: "Post";
  id: number;
  title: string;
  content: string;
  user: GetPost_GetPost_post_user;
  files: GetPost_GetPost_post_files[] | null;
  likeCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetPost_GetPost {
  __typename: "GetPostResponse";
  ok: boolean;
  error: string | null;
  post: GetPost_GetPost_post | null;
  isLiked: boolean | null;
}

export interface GetPost {
  GetPost: GetPost_GetPost;
}

export interface GetPostVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPostList
// ====================================================

export interface GetPostList_GetPostList_posts_user_profilePhoto {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetPostList_GetPostList_posts_user {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  profilePhoto: GetPostList_GetPostList_posts_user_profilePhoto[] | null;
}

export interface GetPostList_GetPostList_posts_files {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetPostList_GetPostList_posts {
  __typename: "Post";
  id: number;
  title: string;
  user: GetPostList_GetPostList_posts_user;
  files: GetPostList_GetPostList_posts_files[] | null;
  createdAt: string;
  readCount: number;
  commentCount: number;
  likeCount: number;
}

export interface GetPostList_GetPostList {
  __typename: "GetPostListResponse";
  ok: boolean;
  error: string | null;
  posts: (GetPostList_GetPostList_posts | null)[] | null;
}

export interface GetPostList {
  GetPostList: GetPostList_GetPostList;
}

export interface GetPostListVariables {
  requestTime: string;
  means: string;
  skip: number;
  take: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddComment
// ====================================================

export interface AddComment_AddComment {
  __typename: "AddCommentResponse";
  ok: boolean;
  error: string | null;
}

export interface AddComment {
  AddComment: AddComment_AddComment;
}

export interface AddCommentVariables {
  postId: number;
  parentId?: number | null;
  content: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCommentList
// ====================================================

export interface GetCommentList_GetCommentList_comments_user {
  __typename: "User";
  id: number;
  gender: string;
  nickName: string;
  birth: string;
}

export interface GetCommentList_GetCommentList_comments {
  __typename: "Comment";
  id: number;
  parentId: number | null;
  content: string;
  depth: number;
  user: GetCommentList_GetCommentList_comments_user;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetCommentList_GetCommentList {
  __typename: "GetCommentListResponse";
  ok: boolean;
  error: string | null;
  comments: (GetCommentList_GetCommentList_comments | null)[] | null;
}

export interface GetCommentList {
  GetCommentList: GetCommentList_GetCommentList;
}

export interface GetCommentListVariables {
  id: number;
  skip: number;
  take: number;
  sort: SortTarget;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TogglePostLike
// ====================================================

export interface TogglePostLike_TogglePostLike {
  __typename: "TogglePostLikeResponse";
  ok: boolean;
  error: string | null;
}

export interface TogglePostLike {
  TogglePostLike: TogglePostLike_TogglePostLike;
}

export interface TogglePostLikeVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: MessageSubscription
// ====================================================

export interface MessageSubscription_MessageSubscription {
  __typename: "MessageSubscribeResponse";
  userId: number;
  text: string;
  target: MessageTarget;
  createdAt: string;
}

export interface MessageSubscription {
  MessageSubscription: MessageSubscription_MessageSubscription | null;
}

export interface MessageSubscriptionVariables {
  chatId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChatUser
// ====================================================

export interface GetChatUser_GetChatUser_user_profilePhoto {
  __typename: "File";
  url: string;
}

export interface GetChatUser_GetChatUser_user {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  profilePhoto: GetChatUser_GetChatUser_user_profilePhoto[] | null;
  gender: string;
  intro: string;
  updatedAt: string | null;
  lastLat: number | null;
  lastLng: number | null;
}

export interface GetChatUser_GetChatUser {
  __typename: "GetChatUserResponse";
  ok: boolean;
  error: string | null;
  user: GetChatUser_GetChatUser_user | null;
}

export interface GetChatUser {
  GetChatUser: GetChatUser_GetChatUser;
}

export interface GetChatUserVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendChatMessage
// ====================================================

export interface SendChatMessage_SendChatMessage {
  __typename: "SendChatMessageResponse";
  ok: boolean;
  error: string | null;
  chatId: number | null;
}

export interface SendChatMessage {
  SendChatMessage: SendChatMessage_SendChatMessage;
}

export interface SendChatMessageVariables {
  chatId?: number | null;
  receiveUserId?: number | null;
  text: string;
  sendTime: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LeaveChat
// ====================================================

export interface LeaveChat_LeaveChat {
  __typename: "LeaveChatResponse";
  ok: boolean;
  error: string | null;
}

export interface LeaveChat {
  LeaveChat: LeaveChat_LeaveChat;
}

export interface LeaveChatVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetUserNotify
// ====================================================

export interface SetUserNotify_SetUserNotify {
  __typename: "SetUserNotifyResponse";
  ok: boolean;
  error: string | null;
}

export interface SetUserNotify {
  SetUserNotify: SetUserNotify_SetUserNotify;
}

export interface SetUserNotifyVariables {
  token: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetLikeMeUserList
// ====================================================

export interface GetLikeMeUserList_GetLikeMeUserList_likes_likeUser_profilePhoto {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetLikeMeUserList_GetLikeMeUserList_likes_likeUser {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  intro: string;
  updatedAt: string | null;
  profilePhoto: GetLikeMeUserList_GetLikeMeUserList_likes_likeUser_profilePhoto[] | null;
  lastLat: number | null;
  lastLng: number | null;
}

export interface GetLikeMeUserList_GetLikeMeUserList_likes {
  __typename: "Like";
  id: number;
  likeUser: GetLikeMeUserList_GetLikeMeUserList_likes_likeUser;
}

export interface GetLikeMeUserList_GetLikeMeUserList {
  __typename: "GetLikeMeUserListResponse";
  ok: boolean;
  error: string | null;
  likes: (GetLikeMeUserList_GetLikeMeUserList_likes | null)[] | null;
}

export interface GetLikeMeUserList {
  GetLikeMeUserList: GetLikeMeUserList_GetLikeMeUserList;
}

export interface GetLikeMeUserListVariables {
  requestTime: string;
  skip: number;
  take: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetILikeUserList
// ====================================================

export interface GetILikeUserList_GetILikeUserList_likes_user_profilePhoto {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetILikeUserList_GetILikeUserList_likes_user {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  intro: string;
  updatedAt: string | null;
  profilePhoto: GetILikeUserList_GetILikeUserList_likes_user_profilePhoto[] | null;
  lastLat: number | null;
  lastLng: number | null;
}

export interface GetILikeUserList_GetILikeUserList_likes {
  __typename: "Like";
  id: number;
  user: GetILikeUserList_GetILikeUserList_likes_user;
}

export interface GetILikeUserList_GetILikeUserList {
  __typename: "GetILikeUserListResponse";
  ok: boolean;
  error: string | null;
  likes: (GetILikeUserList_GetILikeUserList_likes | null)[] | null;
}

export interface GetILikeUserList {
  GetILikeUserList: GetILikeUserList_GetILikeUserList;
}

export interface GetILikeUserListVariables {
  skip: number;
  take: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserProfile
// ====================================================

export interface UpdateUserProfile_UpdateUserProfile {
  __typename: "UpdateUserProfileResponse";
  ok: boolean;
  error: string | null;
}

export interface UpdateUserProfile {
  UpdateUserProfile: UpdateUserProfile_UpdateUserProfile;
}

export interface UpdateUserProfileVariables {
  nickName: string;
  intro: string;
  profilePhoto: PhotoObject[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReportMovement
// ====================================================

export interface ReportMovement_ReportMovement {
  __typename: "ReportMovementResponse";
  ok: boolean;
  error: string | null;
}

export interface ReportMovement {
  ReportMovement: ReportMovement_ReportMovement;
}

export interface ReportMovementVariables {
  lastLat: number;
  lastLng: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyProfile
// ====================================================

export interface GetMyProfile_GetMyProfile_user_profilePhoto {
  __typename: "File";
  id: number;
  url: string;
  key: string;
}

export interface GetMyProfile_GetMyProfile_user {
  __typename: "User";
  id: number;
  nickName: string;
  gender: string;
  birth: string;
  intro: string;
  profilePhoto: GetMyProfile_GetMyProfile_user_profilePhoto[] | null;
  cash: number;
}

export interface GetMyProfile_GetMyProfile {
  __typename: "GetMyProfileResponse";
  ok: boolean;
  error: string | null;
  user: GetMyProfile_GetMyProfile_user | null;
  likeCount: number | null;
}

export interface GetMyProfile {
  GetMyProfile: GetMyProfile_GetMyProfile;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserProfile
// ====================================================

export interface GetUserProfile_GetUserProfile_user_profilePhoto {
  __typename: "File";
  url: string;
}

export interface GetUserProfile_GetUserProfile_user {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  intro: string;
  updatedAt: string | null;
  profilePhoto: GetUserProfile_GetUserProfile_user_profilePhoto[] | null;
  lastLat: number | null;
  lastLng: number | null;
}

export interface GetUserProfile_GetUserProfile {
  __typename: "GetUserProfileResponse";
  ok: boolean;
  error: string | null;
  user: GetUserProfile_GetUserProfile_user | null;
  likeCount: number | null;
  isLiked: boolean | null;
}

export interface GetUserProfile {
  GetUserProfile: GetUserProfile_GetUserProfile;
}

export interface GetUserProfileVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleUserLike
// ====================================================

export interface ToggleUserLike_ToggleUserLike {
  __typename: "ToggleUserLikeResponse";
  ok: boolean;
  error: string | null;
}

export interface ToggleUserLike {
  ToggleUserLike: ToggleUserLike_ToggleUserLike;
}

export interface ToggleUserLikeVariables {
  id: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: VoiceSubscription
// ====================================================

export interface VoiceSubscription_VoiceSubscription {
  __typename: "VoiceSubscriptionResponse";
  channelName: string;
  createdAt: string;
}

export interface VoiceSubscription {
  VoiceSubscription: VoiceSubscription_VoiceSubscription;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: FindVoiceUser
// ====================================================

export interface FindVoiceUser_FindVoiceUser {
  __typename: "FindVoiceUserResponse";
  ok: boolean;
  error: string | null;
  channelName: string | null;
}

export interface FindVoiceUser {
  FindVoiceUser: FindVoiceUser_FindVoiceUser;
}

export interface FindVoiceUserVariables {
  age?: number | null;
  distance?: number | null;
  gender: GenderTarget;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveVoiceWait
// ====================================================

export interface RemoveVoiceWait_RemoveVoiceWait {
  __typename: "RemoveVoiceWaitResponse";
  ok: boolean;
  error: string | null;
}

export interface RemoveVoiceWait {
  RemoveVoiceWait: RemoveVoiceWait_RemoveVoiceWait;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CustomTokenMeansOptions {
  KAKAO = "KAKAO",
}

export enum GenderTarget {
  any = "any",
  female = "female",
  male = "male",
}

export enum GetUserListMeans {
  distance = "distance",
  hot = "hot",
  join = "join",
  login = "login",
}

export enum MessageTarget {
  CHAT = "CHAT",
  LEAVE = "LEAVE",
}

export enum PhotoTarget {
  delete = "delete",
  upload = "upload",
}

export enum SortTarget {
  ASC = "ASC",
  DESC = "DESC",
}

export interface PhotoObject {
  url: string;
  key: string;
  target: PhotoTarget;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
