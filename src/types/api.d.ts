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
// GraphQL query operation: GetMyChat
// ====================================================

export interface GetMyChat_GetMyChat_chat {
  __typename: "Chat";
  id: number;
}

export interface GetMyChat_GetMyChat {
  __typename: "GetMyChatResponse";
  ok: boolean;
  error: string | null;
  chat: (GetMyChat_GetMyChat_chat | null)[] | null;
}

export interface GetMyChat {
  GetMyChat: GetMyChat_GetMyChat;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: MessageSubscription
// ====================================================

export interface MessageSubscription_MessageSubscription {
  __typename: "Message";
  id: number;
  userId: number | null;
  chatId: number | null;
  text: string;
  target: string;
  createdAt: string;
}

export interface MessageSubscription {
  MessageSubscription: MessageSubscription_MessageSubscription | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChatMessages
// ====================================================

export interface GetChatMessages_GetChatMessages_messages {
  __typename: "Message";
  id: number;
  userId: number | null;
  chatId: number | null;
  text: string;
  createdAt: string;
}

export interface GetChatMessages_GetChatMessages {
  __typename: "GetChatMessagesResponse";
  ok: boolean;
  error: string | null;
  messages: (GetChatMessages_GetChatMessages_messages | null)[] | null;
}

export interface GetChatMessages {
  GetChatMessages: GetChatMessages_GetChatMessages;
}

export interface GetChatMessagesVariables {
  id: number;
  requestTime?: string | null;
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

export interface SendChatMessage_SendChatMessage_message {
  __typename: "Message";
  id: number;
  userId: number | null;
  chatId: number | null;
  text: string;
  createdAt: string;
}

export interface SendChatMessage_SendChatMessage {
  __typename: "SendChatMessageResponse";
  ok: boolean;
  error: string | null;
  message: SendChatMessage_SendChatMessage_message | null;
}

export interface SendChatMessage {
  SendChatMessage: SendChatMessage_SendChatMessage;
}

export interface SendChatMessageVariables {
  chatId?: number | null;
  receiveUserId?: number | null;
  text: string;
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
// GraphQL query operation: GetMyProfile
// ====================================================

export interface GetMyProfile_GetMyProfile_user_profilePhoto {
  __typename: "File";
  id: number;
  url: string;
}

export interface GetMyProfile_GetMyProfile_user {
  __typename: "User";
  id: number;
  nickName: string;
  gender: string;
  birth: string;
  profilePhoto: GetMyProfile_GetMyProfile_user_profilePhoto[] | null;
}

export interface GetMyProfile_GetMyProfile {
  __typename: "GetMyProfileResponse";
  ok: boolean;
  error: string | null;
  user: GetMyProfile_GetMyProfile_user | null;
}

export interface GetMyProfile {
  GetMyProfile: GetMyProfile_GetMyProfile;
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
// GraphQL query operation: GetUserList
// ====================================================

export interface GetUserList_GetUserList_users {
  __typename: "User";
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  intro: string;
  updatedAt: string | null;
  lastLat: number | null;
  lastLng: number | null;
}

export interface GetUserList_GetUserList {
  __typename: "GetUserListResponse";
  ok: boolean;
  error: string | null;
  users: (GetUserList_GetUserList_users | null)[] | null;
}

export interface GetUserList {
  GetUserList: GetUserList_GetUserList;
}

export interface GetUserListVariables {
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
// GraphQL query operation: GetUserProfile
// ====================================================

export interface GetUserProfile_GetUserProfile_user {
  __typename: "User";
  id: number;
  nickName: string;
  gender: string;
  birth: string;
  phoneNumber: string;
}

export interface GetUserProfile_GetUserProfile {
  __typename: "GetUserProfileResponse";
  ok: boolean;
  error: string | null;
  user: GetUserProfile_GetUserProfile_user | null;
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

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CustomTokenMeansOptions {
  KAKAO = "KAKAO",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
