import { queryField, stringArg } from 'nexus'
import { getUserId } from '../../utils'

export const notifications = queryField('notifications', {
  type: 'Notification',
  list: true,
  resolve: (parent, args, ctx) => {
    const userId = getUserId(ctx)

    return ctx.prisma.notification.findMany({
      where: { receiver: { id: userId }, type: 'mention' },
      orderBy: { createdAt: 'desc' }
    })
  }
})

export const unreadNotifications = queryField('unreadNotifications', {
  type: 'Notification',
  list: true,
  resolve: (parent, args, ctx) => {
    const userId = getUserId(ctx)

    return ctx.prisma.notification.findMany({
      where: {
        AND: [{ isRead: false }, { receiver: { id: userId } }]
      }
    })
  }
})

export const channelNotifications = queryField('channelNotifications', {
  type: 'Notification',
  list: true,
  args: { channelUrl: stringArg() },
  resolve: (parent, { channelUrl }, ctx) => {
    const userId = getUserId(ctx)

    return ctx.prisma.notification.findMany({
      where: {
        AND: [{ channel: { url: channelUrl } }, { receiver: { id: userId } }, { isRead: false }]
      },
      orderBy: { createdAt: 'desc' }
    })
  }
})

export const communityNotifications = queryField('communityNotifications', {
  type: 'Notification',
  list: true,
  args: { communityUrl: stringArg() },
  resolve: (parent, { communityUrl }, ctx) => {
    const userId = getUserId(ctx)

    return ctx.prisma.notification.findMany({
      where: {
        AND: [{ community: { url: communityUrl } }, { receiver: { id: userId } }, { isRead: false }]
      },
      orderBy: { createdAt: 'desc' }
    })
  }
})
