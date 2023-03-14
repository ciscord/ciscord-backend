/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as PrismaClient from ".prisma/client"
import type { Context } from "./context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ChannelInfoWhereUniqueInput: { // input type
    id?: string | null; // String
    uniqueUserChannelPair?: string | null; // String
  }
  FileWhereUniqueInput: { // input type
    Key?: string | null; // String
    id?: string | null; // String
  }
  NotificationWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  ReplyMessageWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  UserWhereUniqueInput: { // input type
    email?: string | null; // String
    id?: string | null; // String
    username?: string | null; // String
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  AuthPayload: { // root type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Channel: PrismaClient.Channel;
  ChannelInfo: PrismaClient.ChannelInfo;
  Community: PrismaClient.Community;
  CountType: { // root type
    count?: number | null; // Int
  }
  Message: PrismaClient.Message;
  Mutation: {};
  Notification: PrismaClient.Notification;
  OnlinePayload: { // root type
    id: string; // String!
    isOnline: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Query: {};
  Reaction: PrismaClient.Reaction;
  ReplyMessage: PrismaClient.ReplyMessage;
  Role: PrismaClient.Role;
  Subscription: {};
  TypingStatus: { // root type
    isTyping: boolean; // Boolean!
    username: string; // String!
  }
  UnreadMessagePayload: { // root type
    fromNewUser: boolean; // Boolean!
    messages: NexusGenRootTypes['Message'][]; // [Message!]!
    user: NexusGenRootTypes['User']; // User!
  }
  User: PrismaClient.User;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Channel: { // field return type
    author: NexusGenRootTypes['User'] | null; // User
    community: NexusGenRootTypes['Community']; // Community!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    currentChannel: NexusGenRootTypes['User'] | null; // User
    description: string | null; // String
    id: string; // String!
    isPrivate: boolean; // Boolean!
    messages: NexusGenRootTypes['Message'][]; // [Message!]!
    name: string; // String!
    notifications: NexusGenRootTypes['Notification'][]; // [Notification!]!
    typingUsers: NexusGenRootTypes['User'][]; // [User!]!
    url: string; // String!
    userData: NexusGenRootTypes['ChannelInfo'][]; // [ChannelInfo!]!
  }
  ChannelInfo: { // field return type
    channel: NexusGenRootTypes['Channel']; // Channel!
    id: string; // String!
    lastUpdateAt: NexusGenScalars['DateTime']; // DateTime!
    uniqueUserChannelPair: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Community: { // field return type
    author: NexusGenRootTypes['User'] | null; // User
    channels: NexusGenRootTypes['Channel'][]; // [Channel!]!
    description: string | null; // String
    id: string; // String!
    image: string | null; // String
    isPrivate: boolean; // Boolean!
    members: NexusGenRootTypes['User'][]; // [User!]!
    name: string; // String!
    notifications: NexusGenRootTypes['Notification'][]; // [Notification!]!
    url: string; // String!
  }
  CountType: { // field return type
    count: number | null; // Int
  }
  Message: { // field return type
    author: NexusGenRootTypes['User']; // User!
    body: string | null; // String
    channel: NexusGenRootTypes['Channel'] | null; // Channel
    children: NexusGenRootTypes['ReplyMessage'][]; // [ReplyMessage!]!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    reactions: NexusGenRootTypes['Reaction'][]; // [Reaction!]!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    urlList: string[]; // [String!]!
  }
  Mutation: { // field return type
    attachRoleToUser: NexusGenRootTypes['User'] | null; // User
    createChannel: NexusGenRootTypes['Channel'] | null; // Channel
    createCommunity: NexusGenRootTypes['Community'] | null; // Community
    createRole: NexusGenRootTypes['Role'] | null; // Role
    deattachRoleToUser: NexusGenRootTypes['User'] | null; // User
    deleteMessage: NexusGenRootTypes['Message'] | null; // Message
    deleteReplyMessage: NexusGenRootTypes['ReplyMessage'] | null; // ReplyMessage
    deleteRole: NexusGenRootTypes['Role'] | null; // Role
    editChannel: NexusGenRootTypes['Channel'] | null; // Channel
    editMessage: NexusGenRootTypes['Message'] | null; // Message
    editReplyMessage: NexusGenRootTypes['ReplyMessage'] | null; // ReplyMessage
    followCommunity: NexusGenRootTypes['Community'] | null; // Community
    login: NexusGenRootTypes['AuthPayload'] | null; // AuthPayload
    logout: NexusGenRootTypes['User'] | null; // User
    markChannelNotificationsAsRead: NexusGenRootTypes['Notification'] | null; // Notification
    markCommunityNotificationsAsRead: NexusGenRootTypes['Notification'] | null; // Notification
    markNotificationAsRead: NexusGenRootTypes['CountType'] | null; // CountType
    markNotificationsAsRead: NexusGenRootTypes['CountType'] | null; // CountType
    replyMessage: NexusGenRootTypes['ReplyMessage'] | null; // ReplyMessage
    searchMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    sendMessage: NexusGenRootTypes['Message'] | null; // Message
    sendNotification: NexusGenRootTypes['Notification'] | null; // Notification
    setCurrentChannel: NexusGenRootTypes['User'] | null; // User
    setUserTypingStatus: NexusGenRootTypes['TypingStatus'] | null; // TypingStatus
    signup: NexusGenRootTypes['AuthPayload'] | null; // AuthPayload
    toggleReaction: NexusGenRootTypes['Reaction'] | null; // Reaction
    unfollowCommunity: NexusGenRootTypes['Community'] | null; // Community
    updateChannelInfo: NexusGenRootTypes['User'] | null; // User
    updateRole: NexusGenRootTypes['Role'] | null; // Role
    updateUser: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['User'] | null; // User
  }
  Notification: { // field return type
    action: string | null; // String
    body: string | null; // String
    channel: NexusGenRootTypes['Channel'] | null; // Channel
    community: NexusGenRootTypes['Community'] | null; // Community
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    isRead: boolean; // Boolean!
    message: NexusGenRootTypes['Message'] | null; // Message
    receiver: NexusGenRootTypes['User']; // User!
    sender: NexusGenRootTypes['User']; // User!
    type: string | null; // String
  }
  OnlinePayload: { // field return type
    id: string; // String!
    isOnline: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    allMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    channel: NexusGenRootTypes['Channel'] | null; // Channel
    channelNotifications: Array<NexusGenRootTypes['Notification'] | null> | null; // [Notification]
    channels: Array<NexusGenRootTypes['Channel'] | null> | null; // [Channel]
    communities: Array<NexusGenRootTypes['Community'] | null> | null; // [Community]
    community: NexusGenRootTypes['Community'] | null; // Community
    communityNotifications: Array<NexusGenRootTypes['Notification'] | null> | null; // [Notification]
    getLastMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    getNextMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    getPrevMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    getUnreadMessagesCount: NexusGenRootTypes['UnreadMessagePayload'] | null; // UnreadMessagePayload
    getUser: NexusGenRootTypes['User'] | null; // User
    me: NexusGenRootTypes['User'] | null; // User
    messageReplies: Array<NexusGenRootTypes['ReplyMessage'] | null> | null; // [ReplyMessage]
    notifications: Array<NexusGenRootTypes['Notification'] | null> | null; // [Notification]
    privateChannels: Array<NexusGenRootTypes['Channel'] | null> | null; // [Channel]
    reactions: Array<NexusGenRootTypes['Reaction'] | null> | null; // [Reaction]
    replyMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    roles: Array<NexusGenRootTypes['Role'] | null> | null; // [Role]
    searchCommunities: Array<NexusGenRootTypes['Community'] | null> | null; // [Community]
    searchMessages: Array<NexusGenRootTypes['Message'] | null> | null; // [Message]
    unreadNotifications: Array<NexusGenRootTypes['Notification'] | null> | null; // [Notification]
    users: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  Reaction: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    message: NexusGenRootTypes['Message']; // Message!
    name: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  ReplyMessage: { // field return type
    author: NexusGenRootTypes['User']; // User!
    body: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    parent: NexusGenRootTypes['Message']; // Message!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    urlList: string[]; // [String!]!
  }
  Role: { // field return type
    color: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    roleSettings: string; // String!
    title: string; // String!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  Subscription: { // field return type
    channelNewMessage: NexusGenRootTypes['Channel'] | null; // Channel
    deleteMessage: NexusGenRootTypes['Message'] | null; // Message
    editMessage: NexusGenRootTypes['Message'] | null; // Message
    newMessage: NexusGenRootTypes['Message'] | null; // Message
    newNotification: NexusGenRootTypes['Notification'] | null; // Notification
    newReaction: NexusGenRootTypes['Reaction'] | null; // Reaction
    removedReaction: NexusGenRootTypes['Reaction'] | null; // Reaction
    updatedReaction: NexusGenRootTypes['Reaction'] | null; // Reaction
    userTypingStatus: NexusGenRootTypes['TypingStatus'] | null; // TypingStatus
    userWentOffline: NexusGenRootTypes['User'] | null; // User
    userWentOnline: NexusGenRootTypes['User'] | null; // User
  }
  TypingStatus: { // field return type
    isTyping: boolean; // Boolean!
    username: string; // String!
  }
  UnreadMessagePayload: { // field return type
    fromNewUser: boolean; // Boolean!
    messages: NexusGenRootTypes['Message'][]; // [Message!]!
    user: NexusGenRootTypes['User']; // User!
  }
  User: { // field return type
    bio: string | null; // String
    chanelAuthor: NexusGenRootTypes['Channel'] | null; // Channel
    channelsInfo: NexusGenRootTypes['ChannelInfo'][]; // [ChannelInfo!]!
    communitiesFollowed: NexusGenRootTypes['Community'][]; // [Community!]!
    communitiesOwned: NexusGenRootTypes['Community'][]; // [Community!]!
    currentChannel: NexusGenRootTypes['Channel'] | null; // Channel
    email: string | null; // String
    fullname: string; // String!
    id: string; // String!
    image: string | null; // String
    isOnline: boolean; // Boolean!
    messages: NexusGenRootTypes['Message'][]; // [Message!]!
    notificationsReceived: NexusGenRootTypes['Notification'][]; // [Notification!]!
    notificationsSend: NexusGenRootTypes['Notification'][]; // [Notification!]!
    owner: string | null; // String
    password: string | null; // String
    reactions: NexusGenRootTypes['Reaction'][]; // [Reaction!]!
    replyMessages: NexusGenRootTypes['ReplyMessage'][]; // [ReplyMessage!]!
    role: NexusGenRootTypes['Role'][]; // [Role!]!
    social: string | null; // String
    username: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  AuthPayload: { // field return type name
    token: 'String'
    user: 'User'
  }
  Channel: { // field return type name
    author: 'User'
    community: 'Community'
    createdAt: 'DateTime'
    currentChannel: 'User'
    description: 'String'
    id: 'String'
    isPrivate: 'Boolean'
    messages: 'Message'
    name: 'String'
    notifications: 'Notification'
    typingUsers: 'User'
    url: 'String'
    userData: 'ChannelInfo'
  }
  ChannelInfo: { // field return type name
    channel: 'Channel'
    id: 'String'
    lastUpdateAt: 'DateTime'
    uniqueUserChannelPair: 'String'
    user: 'User'
  }
  Community: { // field return type name
    author: 'User'
    channels: 'Channel'
    description: 'String'
    id: 'String'
    image: 'String'
    isPrivate: 'Boolean'
    members: 'User'
    name: 'String'
    notifications: 'Notification'
    url: 'String'
  }
  CountType: { // field return type name
    count: 'Int'
  }
  Message: { // field return type name
    author: 'User'
    body: 'String'
    channel: 'Channel'
    children: 'ReplyMessage'
    createdAt: 'DateTime'
    id: 'String'
    reactions: 'Reaction'
    updatedAt: 'DateTime'
    urlList: 'String'
  }
  Mutation: { // field return type name
    attachRoleToUser: 'User'
    createChannel: 'Channel'
    createCommunity: 'Community'
    createRole: 'Role'
    deattachRoleToUser: 'User'
    deleteMessage: 'Message'
    deleteReplyMessage: 'ReplyMessage'
    deleteRole: 'Role'
    editChannel: 'Channel'
    editMessage: 'Message'
    editReplyMessage: 'ReplyMessage'
    followCommunity: 'Community'
    login: 'AuthPayload'
    logout: 'User'
    markChannelNotificationsAsRead: 'Notification'
    markCommunityNotificationsAsRead: 'Notification'
    markNotificationAsRead: 'CountType'
    markNotificationsAsRead: 'CountType'
    replyMessage: 'ReplyMessage'
    searchMessages: 'Message'
    sendMessage: 'Message'
    sendNotification: 'Notification'
    setCurrentChannel: 'User'
    setUserTypingStatus: 'TypingStatus'
    signup: 'AuthPayload'
    toggleReaction: 'Reaction'
    unfollowCommunity: 'Community'
    updateChannelInfo: 'User'
    updateRole: 'Role'
    updateUser: 'User'
    users: 'User'
  }
  Notification: { // field return type name
    action: 'String'
    body: 'String'
    channel: 'Channel'
    community: 'Community'
    createdAt: 'DateTime'
    id: 'String'
    isRead: 'Boolean'
    message: 'Message'
    receiver: 'User'
    sender: 'User'
    type: 'String'
  }
  OnlinePayload: { // field return type name
    id: 'String'
    isOnline: 'String'
    user: 'User'
  }
  Query: { // field return type name
    allMessages: 'Message'
    channel: 'Channel'
    channelNotifications: 'Notification'
    channels: 'Channel'
    communities: 'Community'
    community: 'Community'
    communityNotifications: 'Notification'
    getLastMessages: 'Message'
    getNextMessages: 'Message'
    getPrevMessages: 'Message'
    getUnreadMessagesCount: 'UnreadMessagePayload'
    getUser: 'User'
    me: 'User'
    messageReplies: 'ReplyMessage'
    notifications: 'Notification'
    privateChannels: 'Channel'
    reactions: 'Reaction'
    replyMessages: 'Message'
    roles: 'Role'
    searchCommunities: 'Community'
    searchMessages: 'Message'
    unreadNotifications: 'Notification'
    users: 'User'
  }
  Reaction: { // field return type name
    createdAt: 'DateTime'
    id: 'String'
    message: 'Message'
    name: 'String'
    updatedAt: 'DateTime'
    users: 'User'
  }
  ReplyMessage: { // field return type name
    author: 'User'
    body: 'String'
    createdAt: 'DateTime'
    id: 'String'
    parent: 'Message'
    updatedAt: 'DateTime'
    urlList: 'String'
  }
  Role: { // field return type name
    color: 'String'
    createdAt: 'DateTime'
    id: 'String'
    roleSettings: 'String'
    title: 'String'
    users: 'User'
  }
  Subscription: { // field return type name
    channelNewMessage: 'Channel'
    deleteMessage: 'Message'
    editMessage: 'Message'
    newMessage: 'Message'
    newNotification: 'Notification'
    newReaction: 'Reaction'
    removedReaction: 'Reaction'
    updatedReaction: 'Reaction'
    userTypingStatus: 'TypingStatus'
    userWentOffline: 'User'
    userWentOnline: 'User'
  }
  TypingStatus: { // field return type name
    isTyping: 'Boolean'
    username: 'String'
  }
  UnreadMessagePayload: { // field return type name
    fromNewUser: 'Boolean'
    messages: 'Message'
    user: 'User'
  }
  User: { // field return type name
    bio: 'String'
    chanelAuthor: 'Channel'
    channelsInfo: 'ChannelInfo'
    communitiesFollowed: 'Community'
    communitiesOwned: 'Community'
    currentChannel: 'Channel'
    email: 'String'
    fullname: 'String'
    id: 'String'
    image: 'String'
    isOnline: 'Boolean'
    messages: 'Message'
    notificationsReceived: 'Notification'
    notificationsSend: 'Notification'
    owner: 'String'
    password: 'String'
    reactions: 'Reaction'
    replyMessages: 'ReplyMessage'
    role: 'Role'
    social: 'String'
    username: 'String'
  }
}

export interface NexusGenArgTypes {
  Channel: {
    typingUsers: { // args
      after?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
      before?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    userData: { // args
      after?: NexusGenInputs['ChannelInfoWhereUniqueInput'] | null; // ChannelInfoWhereUniqueInput
      before?: NexusGenInputs['ChannelInfoWhereUniqueInput'] | null; // ChannelInfoWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Mutation: {
    attachRoleToUser: { // args
      roleId?: string | null; // String
      userId: string; // String!
    }
    createChannel: { // args
      communityUrl?: string | null; // String
      description?: string | null; // String
      isPrivate?: boolean | null; // Boolean
      name?: string | null; // String
      url?: string | null; // String
    }
    createCommunity: { // args
      description?: string | null; // String
      image?: string | null; // String
      isPrivate?: boolean | null; // Boolean
      name: string; // String!
      url: string; // String!
    }
    createRole: { // args
      color?: string | null; // String
      roleSettings?: string | null; // String
      title?: string | null; // String
    }
    deattachRoleToUser: { // args
      roleId: string; // String!
      userId: string; // String!
    }
    deleteMessage: { // args
      messageId?: string | null; // String
    }
    deleteReplyMessage: { // args
      messageId?: string | null; // String
    }
    deleteRole: { // args
      id?: string | null; // String
    }
    editChannel: { // args
      channelId?: string | null; // String
      description?: string | null; // String
      name?: string | null; // String
    }
    editMessage: { // args
      body?: string | null; // String
      messageId?: string | null; // String
    }
    editReplyMessage: { // args
      body?: string | null; // String
      messageId?: string | null; // String
    }
    followCommunity: { // args
      url?: string | null; // String
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
    markChannelNotificationsAsRead: { // args
      channelUrl?: string | null; // String
    }
    markCommunityNotificationsAsRead: { // args
      communityUrl?: string | null; // String
    }
    markNotificationAsRead: { // args
      id?: string | null; // String
    }
    markNotificationsAsRead: { // args
      type?: string | null; // String
    }
    replyMessage: { // args
      body?: string | null; // String
      parentId?: string | null; // String
      urlList?: Array<string | null> | null; // [String]
    }
    searchMessages: { // args
      channelUrl?: string | null; // String
      searchQuery?: string | null; // String
    }
    sendMessage: { // args
      body?: string | null; // String
      channelUrl?: string | null; // String
      communityUrl?: string | null; // String
      mentions?: Array<string | null> | null; // [String]
      urlList?: Array<string | null> | null; // [String]
    }
    sendNotification: { // args
      channelUrl?: string | null; // String
      communityUrl?: string | null; // String
      messageId?: string | null; // ID
      receiverName?: string | null; // String
      type?: string | null; // String
    }
    setCurrentChannel: { // args
      channelUrl?: string | null; // String
    }
    setUserTypingStatus: { // args
      channelUrl?: string | null; // String
      isTyping?: boolean | null; // Boolean
    }
    signup: { // args
      bio?: string | null; // String
      email: string; // String!
      fullname: string; // String!
      password: string; // String!
      username: string; // String!
    }
    toggleReaction: { // args
      messageId?: string | null; // String
      name?: string | null; // String
    }
    unfollowCommunity: { // args
      url?: string | null; // String
    }
    updateChannelInfo: { // args
      channelUrl: string; // String!
      date: string; // String!
    }
    updateRole: { // args
      color?: string | null; // String
      id?: string | null; // String
      roleSettings?: string | null; // String
      title?: string | null; // String
    }
    updateUser: { // args
      email: string; // String!
      fullname: string; // String!
      image?: string | null; // String
      username: string; // String!
    }
    users: { // args
      searchString?: string | null; // String
    }
  }
  Query: {
    allMessages: { // args
      channelUrl?: string | null; // String
    }
    channel: { // args
      url: string; // String!
    }
    channelNotifications: { // args
      channelUrl?: string | null; // String
    }
    channels: { // args
      communityUrl: string; // String!
    }
    community: { // args
      id?: string | null; // ID
      url?: string | null; // String
    }
    communityNotifications: { // args
      communityUrl?: string | null; // String
    }
    getLastMessages: { // args
      channelUrl?: string | null; // String
      cursorId?: string | null; // ID
      lastVisitDate?: string | null; // String
      number?: string | null; // String
    }
    getNextMessages: { // args
      channelUrl?: string | null; // String
      cursorId?: string | null; // ID
      number?: string | null; // String
    }
    getPrevMessages: { // args
      channelUrl?: string | null; // String
      cursorId?: string | null; // ID
      number?: string | null; // String
    }
    getUnreadMessagesCount: { // args
      channelUrl?: string | null; // String
      username?: string | null; // String
    }
    getUser: { // args
      username: string; // String!
    }
    messageReplies: { // args
      after?: string | null; // ID
      messageId?: string | null; // String
    }
    reactions: { // args
      messageId?: string | null; // String
    }
    replyMessages: { // args
      after?: string | null; // ID
      channelUrl?: string | null; // String
    }
    searchCommunities: { // args
      searchString?: string | null; // String
    }
    searchMessages: { // args
      channelUrl?: string | null; // String
      searchQuery?: string | null; // String
    }
    users: { // args
      searchString?: string | null; // String
    }
  }
  Role: {
    users: { // args
      after?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
      before?: NexusGenInputs['UserWhereUniqueInput'] | null; // UserWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Subscription: {
    channelNewMessage: { // args
      communityUrl?: string | null; // String
      tenant?: string | null; // String
    }
    deleteMessage: { // args
      channelUrl?: string | null; // String
      tenant?: string | null; // String
    }
    editMessage: { // args
      channelUrl?: string | null; // String
      tenant?: string | null; // String
    }
    newMessage: { // args
      channelUrl?: string | null; // String
      tenant?: string | null; // String
    }
    newNotification: { // args
      receiverId?: string | null; // String
      tenant?: string | null; // String
    }
    newReaction: { // args
      channelUrl?: string | null; // String
      tenant?: string | null; // String
    }
    removedReaction: { // args
      channelUrl?: string | null; // String
      tenant?: string | null; // String
    }
    updatedReaction: { // args
      channelUrl?: string | null; // String
      tenant?: string | null; // String
    }
    userTypingStatus: { // args
      channelUrl?: string | null; // String
      tenant?: string | null; // String
      username?: string | null; // String
    }
    userWentOffline: { // args
      tenant?: string | null; // String
    }
    userWentOnline: { // args
      tenant?: string | null; // String
    }
  }
  User: {
    notificationsReceived: { // args
      after?: NexusGenInputs['NotificationWhereUniqueInput'] | null; // NotificationWhereUniqueInput
      before?: NexusGenInputs['NotificationWhereUniqueInput'] | null; // NotificationWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    notificationsSend: { // args
      after?: NexusGenInputs['NotificationWhereUniqueInput'] | null; // NotificationWhereUniqueInput
      before?: NexusGenInputs['NotificationWhereUniqueInput'] | null; // NotificationWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
    replyMessages: { // args
      after?: NexusGenInputs['ReplyMessageWhereUniqueInput'] | null; // ReplyMessageWhereUniqueInput
      before?: NexusGenInputs['ReplyMessageWhereUniqueInput'] | null; // ReplyMessageWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * The nullability guard can be helpful, but is also a potentially expensive operation for lists.
     * We need to iterate the entire list to check for null items to guard against. Set this to true
     * to skip the null guard on a specific field if you know there's no potential for unsafe types.
     */
    skipNullGuard?: boolean
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}