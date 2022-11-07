import { rule, shield, and, or, not } from 'graphql-shield'
import { getUserId, isEmpty } from '../utils'

const isAuthenticatedUser = rule()(
  async (parent, args, context) => {
    const userId = getUserId(context)
    const isAuth = !isEmpty(userId)

    console.log('isAuthenticatedUser' + isAuth)
    return isAuth;
  }
);

const isOwner = rule()(
  async (parent, { id }, context) => {
    const userId = getUserId(context)

    if (!userId) return false;
    try {
      const user = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      })
      if (user.owner && user.owner === '1') {
        return true;
      }

      return false;
    } catch (error) {
      console.log('canManageCommunity - NO', error)
      return false;
    }

  }
);


const canManageCommunity = rule()(
  async (parent, { id }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()

      let result = false;
      roles.forEach((role: any) => {
        if (role.roleSettings.includes('manage_community')) {
          result = true;
        }
      });
      return result;
    } catch (error) {
      console.log('canManageCommunity - NO', error)
      return false;
    }

  }
);

const canManageChannel = rule()(
  async (parent, { id }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()

      let result = false;
      roles.forEach((role: any) => {
        if (role.roleSettings.includes('manage_channel')) {
          result = true;
        }
      });
      return result;
    } catch (error) {
      console.log('canManageChannel - NO', error)
      return false;
    }

  }
);

const canManageRole = rule()(
  async (parent, { id }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()

      let result = false;
      roles.forEach((role: any) => {
        if (role.roleSettings.includes('manage_role')) {
          result = true;
        }
      });
      console.log('canManageRole', result)
      return result;
    } catch (error) {
      console.log('canManageRole - NO', error)
      return false;
    }

  }
);

const canChatPermission = rule()(
  async (parent, { id }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()

      let result = false;
      roles.forEach((role: any) => {
        if (role.roleSettings.includes('chat_permission')) {
          result = true;
        }
      });
      console.log('canChatPermission', result)
      return result;
    } catch (error) {
      console.log('canChatPermission - NO', error)
      return false;
    }
  }
);

const canUploadImage = rule()(
  async (parent, { id }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()

      let result = false;
      roles.forEach((role: any) => {
        if (role.roleSettings.includes('upload_image')) {
          result = true;
        }
      });
      console.log('canUploadImage', result)
      return result;
    } catch (error) {
      console.log('canUploadImage - NO', error)
      return false;
    }
  }
);

const canPostLinks = rule()(
  async (parent, { id }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()
      let result = false;
      roles.forEach((role: any) => {
        if (role.roleSettings.includes('post_links')) {
          result = true;
        }
      });
      console.log('canUploadImage', result)
      return result;
    } catch (error) {
      console.log('canUploadImage - NO', error)
      return false;
    }
  }
);

const canDeleteMessage = rule()(
  async (parent, { messageId }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      let result = false;
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()

      roles.forEach((role: any) => {
        if (role.roleSettings.includes('delete_message')) {
          result = true;
        }
      });

      if (result) return true;
      const requestingUserIsAuthor = await context.prisma.message.findMany({
        where: {
          id: messageId,
          author: {id: userId},
        }
      })

      if (requestingUserIsAuthor[0]) {
        result = true;
      };
      console.log('canDeleteMessage', result)
      return result;


    } catch (error) {
      console.log('canDeleteMessage - NO', error)
      return false;
    }

  }
);

const canEditMessage = rule()(
  async (parent, { messageId }, context) => {
    const userId = getUserId(context)
    if (!userId) return false;
    try {
      let result = false;
      const roles = await context.prisma.user.findOne({
        where: {
          id: userId,
        },
      }).role()

      const requestingUserIsAuthor = await context.prisma.message.findMany({
        where: {
          id: messageId,
          author: {id: userId},
        }
      })

      if (requestingUserIsAuthor[0]) {
        result = true;
      };
      console.log('canEditMessage', result)
      return result;


    } catch (error) {
      console.log('canEditMessage - NO', error)
      return false;
    }

  }
);

const anyUser = rule()(
  async (parent, args, context) => {
    console.log('AnyUser' + context.request.get('ciscord-tenant'))
    return true;
  }
);

export const permissions = shield({
  Query: {
    users: isAuthenticatedUser,
    channels: anyUser,
    channel: anyUser,
    community: anyUser,
    communities: anyUser,
    allMessages: anyUser,
    getLastMessages: anyUser,
    getPrevMessages: anyUser,
    getNextMessages: anyUser,
    searchCommunities: anyUser,
    notifications: isAuthenticatedUser,
    unreadNotifications: isAuthenticatedUser,
    channelNotifications: isAuthenticatedUser,
    communityNotifications: isAuthenticatedUser,
    reactions: isAuthenticatedUser,
    replyMessages: isAuthenticatedUser,
  },
  Mutation: {
    setCurrentChannel: isAuthenticatedUser,
    createCommunity: or(isOwner, and(isAuthenticatedUser, canManageCommunity)),
    followCommunity: isAuthenticatedUser,
    unfollowCommunity: isAuthenticatedUser,
    createChannel: or(isOwner, and(isAuthenticatedUser, canManageChannel)),
    editChannel: or(isOwner, and(isAuthenticatedUser, canManageChannel)),
    setUserTypingStatus: or(isOwner, and(isAuthenticatedUser, canChatPermission)),
    sendMessage: or(isOwner, and(isAuthenticatedUser, canChatPermission)),
    updateChannelInfo: isAuthenticatedUser,
    deleteMessage: or(isOwner, and(isAuthenticatedUser, canDeleteMessage)),
    editMessage: or(isOwner, and(isAuthenticatedUser, canEditMessage)),
    sendNotification: isAuthenticatedUser,
    markNotificationsAsRead: isAuthenticatedUser,
    markChannelNotificationsAsRead: isAuthenticatedUser,
    markCommunityNotificationsAsRead: isAuthenticatedUser,
    uploadFile: or(isOwner, and(isAuthenticatedUser, canUploadImage)),
    createRole: or(isOwner, and(isAuthenticatedUser, canManageRole)),
    updateRole: or(isOwner, and(isAuthenticatedUser, canManageRole)),
    deleteRole: or(isOwner, and(isAuthenticatedUser, canManageRole)),
  },
})