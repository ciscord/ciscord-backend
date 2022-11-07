import * as UserQuery from './User/UserQuery';
import * as CommunityQuery from './Community/CommunityQuery';
import * as ChannelQuery from './Channel/ChannelQuery';
import * as MessageQuery from './Message/MessageQuery';
import * as FileQuery from './File/FileQuery';
import * as ReplyMessageQuery from './ReplyMessage/ReplyMessageQuery';
import * as ReactionQuery from './Reaction/ReactionQuery';
import * as NotificationQuery from './Notification/NotificationQuery';
import * as RoleQuery from './Role/RoleQuery';

export const Query = {
  me: { UserQuery },
  getUser: { UserQuery },
  users: { UserQuery },
  community: { CommunityQuery },
  communities: { CommunityQuery },
  searchCommunities: { CommunityQuery },
  channel: { ChannelQuery },
  channels: { ChannelQuery },
  messages: { MessageQuery },
  files: { FileQuery },
  roles: { RoleQuery },
  replyMessages: { ReplyMessageQuery },
  reactions: { ReactionQuery },
  notifications: { NotificationQuery },
  channelNotifications: { NotificationQuery },
  communityNotifications: { NotificationQuery },
  privateChannels: { ChannelQuery },
};

