import { queryField, stringArg, list } from 'nexus'
import { getUserId } from '../../utils'

export const notifications = queryField('notifications', {
  type: list('Notification'),
  
  resolve: (parent, args, Context) => {
    const userId = getUserId(Context)

    return Context.prisma.notification.findMany({
      where: { receiverId: userId, type: 'mention' },
      orderBy: { createdAt: 'desc' }
    })
  }
})

export const unreadNotifications = queryField('unreadNotifications', {
  type: list('Notification'),
  
  resolve: (parent, args, Context) => {
    const userId = getUserId(Context)

    return Context.prisma.notification.findMany({
      where: {
        AND: [{ isRead: false }, { receiverId: userId }]
      }
    })
  }
})

export const channelNotifications = queryField('channelNotifications', {
  type: list('Notification'),
  
  args: { channelUrl: stringArg() },
  resolve: (parent, { channelUrl }, Context) => {
    const userId = getUserId(Context)

    return Context.prisma.notification.findMany({
      where: {
        AND: [{ channel: { url: channelUrl! } }, { receiverId: userId }, { isRead: false }]
      },
      orderBy: { createdAt: 'desc' }
    })
  }
})

export const communityNotifications = queryField('communityNotifications', {
  type: list('Notification'),
  
  args: { communityUrl: stringArg() },
  resolve: (parent, { communityUrl }, Context) => {
    const userId = getUserId(Context)

    return Context.prisma.notification.findMany({
      where: {
        AND: [{ community: { url: communityUrl! } }, { receiverId: userId }, { isRead: false }]
      },
      orderBy: { createdAt: 'desc' },
    })
  }
})
