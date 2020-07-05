/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StartPhoneVerification
// ====================================================

export interface StartPhoneVerification_StartPhoneVerification {
  __typename: "StartPhoneVerificationResponse";
  ok: boolean;
  error: string | null;
}

export interface StartPhoneVerification {
  StartPhoneVerification: StartPhoneVerification_StartPhoneVerification | null;
}

export interface StartPhoneVerificationVariables {
  phoneNumber: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CompletePhoneVerification
// ====================================================

export interface CompletePhoneVerification_CompletePhoneVerification {
  __typename: "CompletePhoneVerificationResponse";
  ok: boolean;
  error: string | null;
  userId: number | null;
  token: string | null;
}

export interface CompletePhoneVerification {
  CompletePhoneVerification: CompletePhoneVerification_CompletePhoneVerification;
}

export interface CompletePhoneVerificationVariables {
  phoneNumber: string;
  key: string;
  nickName: string;
  gender: string;
  birth: string;
  fbId?: string | null;
  ggId?: string | null;
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
  GetChatMessages: GetChatMessages_GetChatMessages | null;
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
// GraphQL query operation: GetMyProfile
// ====================================================

export interface GetMyProfile_GetMyProfile_user {
  __typename: "User";
  id: number;
  nickName: string;
  gender: string;
  birth: string;
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

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
