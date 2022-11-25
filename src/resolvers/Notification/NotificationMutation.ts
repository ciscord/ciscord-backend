import { mutationField, idArg, stringArg, objectType } from 'nexus'
import { getUserId, getTenant } from '../../utils'
import { Notification } from '../index'

export const sendNotification = mutationField('sendNotification', {
  type: 'Notification',
  args: {
    messageId: idArg(),
    receiverName: stringArg(),
    channelUrl: stringArg(),
    communityUrl: stringArg(),
    type: stringArg()
  },
  resolve: async (parent, { messageId, receiverName, channelUrl, communityUrl, type }, Context) => {
    const userId = await getUserId(Context)

    const notification = await Context.prisma.notification.create({
      data: {
        type,
        sender: { connect: { id: userId } },
        receiver: { connect: { username: receiverName } },
        message: { connect: { id: messageId } },
        channel: { connect: { url: channelUrl } },
        community: { connect: { url: communityUrl } }
      },
      include: {
        sender: true,
        receiver: true,
        message: true,
        channel: true
      }
    })
    Context.pubsub.publish('NEW_NOTIFICATION', {
      newNotification: notification,
      tenant: getTenant(Context)
    })

    return notification
  }
})

export const markNotificationAsRead = mutationField('markNotificationAsRead', {
  type: 'CountType',
  args: {
    id: stringArg()
  },
  resolve: async (parent, { id }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.notification.updateMany({
      where: {
        id,
        receiver: { id: userId }
      },
      data: { isRead: true }
    })
  }
})

export const markNotificationsAsRead = mutationField('markNotificationsAsRead', {
  type: 'CountType',
  args: {
    type: stringArg()
  },
  resolve: async (parent, { type }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.notification.updateMany({
      where: {
        AND: [{ isRead: false }, { receiver: { id: userId } }, { type: type }]
      },
      data: { isRead: true }
    })
  }
})

export const markChannelNotificationsAsRead = mutationField('markChannelNotificationsAsRead', {
  type: 'Notification',
  args: { channelUrl: stringArg() },
  resolve: async (parent, { channelUrl }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.notification.updateMany({
      where: {
        AND: [{ isRead: false }, { receiver: { id: userId } }, { channel: { url: channelUrl } }]
      },
      data: { isRead: true }
    })
  }
})

export const markCommunityNotificationsAsRead = mutationField('markCommunityNotificationsAsRead', {
  type: 'Notification',
  args: { communityUrl: stringArg() },
  resolve: async (parent, { communityUrl }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.notification.updateMany({
      where: {
        AND: [{ isRead: false }, { receiver: { id: userId } }, { community: { url: communityUrl } }]
      },
      data: { isRead: true }
    })
  }
})
