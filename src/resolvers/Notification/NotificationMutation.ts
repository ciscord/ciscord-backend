import { mutationField, idArg, stringArg, objectType } from 'nexus'
import { getUserId, getTenant } from '../../utils'

const CountType = objectType({
  name: 'Count',
  definition(t) {
    t.field('count', { type: 'Int' })
  }
})

export const sendNotification = mutationField('sendNotification', {
  type: 'Notification',
  args: {
    messageId: idArg(),
    receiverName: stringArg(),
    channelUrl: stringArg(),
    communityUrl: stringArg(),
    type: stringArg()
  },
  resolve: async (parent, { messageId, receiverName, channelUrl, communityUrl, type }, ctx) => {
    const userId = await getUserId(ctx)

    const notification = await ctx.prisma.notification.create({
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
    ctx.pubsub.publish('NEW_NOTIFICATION', {
      newNotification: notification,
      tenant: getTenant(ctx)
    })

    return notification
  }
})

export const markNotificationAsRead = mutationField('markNotificationAsRead', {
  type: CountType,
  args: {
    id: stringArg()
  },
  resolve: async (parent, { id }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.notification.updateMany({
      where: {
        id,
        receiver: { id: userId }
      },
      data: { isRead: true }
    })
  }
})

export const markNotificationsAsRead = mutationField('markNotificationsAsRead', {
  type: CountType,
  args: {
    type: stringArg()
  },
  resolve: async (parent, { type }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.notification.updateMany({
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
  resolve: async (parent, { channelUrl }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.notification.updateMany({
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
  resolve: async (parent, { communityUrl }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.notification.updateMany({
      where: {
        AND: [{ isRead: false }, { receiver: { id: userId } }, { community: { url: communityUrl } }]
      },
      data: { isRead: true }
    })
  }
})
