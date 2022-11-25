import { GraphQLUpload as Upload } from 'graphql-upload'
import { Query } from './Query'
import { Mutation } from './Mutation'
import { Subscription } from './Subscription'
import { User } from './User/UserType'
import { Reaction } from './Reaction/ReactionType'
import { AuthPayload } from './User/AuthPayloadType'
import { OnlinePayload } from './User/OnlinePayload'
import { TwitterPayload } from './User/TwitterPayloadType'
import { UnreadMessagePayload } from './Message/UnreadMessageType'
import { Community } from './Community/CommunityType'
import { Channel } from './Channel/ChannelType'
import { ChannelInfo } from './ChannelInfo/ChannelInfoType'
import { Message } from './Message/MessageType'
import { ReplyMessage } from './ReplyMessage/ReplyMessageType'
import { RemoteAttachment } from './RemoteAttachment/RemoteAttachmentType'
import { Notification } from './Notification/NotificationType'
import { TypingStatus } from './TypingStatus/TypingStatusType'
import { File } from './File/FileType'
import { Role } from './Role/RoleType'

export const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Role,
  AuthPayload,
  OnlinePayload,
  TwitterPayload,
  UnreadMessagePayload,
  Community,
  Channel,
  ChannelInfo,
  Message,
  ReplyMessage,
  Reaction,
  Notification,
  File,
  RemoteAttachment,
  Upload,
  TypingStatus
}
