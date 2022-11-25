import * as UserMutation from './User/UserMutation';
import * as CommunityMutation from './Community/CommunityMutation';
import * as ChannelMutation from './Channel/ChannelMutation';
import * as MessageMutation from './Message/MessageMutation';
import * as ReplyMessageMutation from './ReplyMessage/ReplyMessageMutation';
import * as TypingStatusMutation from './TypingStatus/TypingStatusMutation';
import * as ReactionMutation from './Reaction/ReactionMutation';
import * as NotificationMutation from './Notification/NotificationMutation';
import * as FileMutation from './File/FileMutation';
import * as ChannelInfo from './ChannelInfo/ChannelInfoMutation';
import * as RoleMutation from './Role/RoleMutation';

export const Mutation = {
  login: { UserMutation },
  updateUser: { UserMutation },
  users: { UserMutation },
  createCommunity: { CommunityMutation },
  followCommunity: { CommunityMutation },
  unfollowCommunity: { CommunityMutation },
  createChannel: { ChannelMutation },
  setUserTypingStatus: { TypingStatusMutation },
  editChannel: { ChannelMutation },
  createRole: { RoleMutation },
  updateRole: { RoleMutation },
  deleteRole: { RoleMutation },
  updateChannelInfo: { ChannelInfo },
  attachRoleToUser: { RoleMutation },
  deattachRoleToUser: { RoleMutation },
  sendMessage: { MessageMutation },
  deleteMessage: { MessageMutation },
  sendReply: { ReplyMessageMutation },
  sendReaction: { ReactionMutation },
  sendNotification: { NotificationMutation },
  markNotificationsAsRead: { NotificationMutation },
  markChannelNotificationsAsRead: { NotificationMutation },
  markCommunityNotificationsAsRead: { NotificationMutation },
  uploadFile: { FileMutation },
};
