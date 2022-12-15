import { queryField, stringArg, idArg, nullable, list } from 'nexus'
import { getUserId, isEmpty } from '../../utils'

const messagesNumber = 30

export const lastMessages = queryField('getLastMessages', {
  type: list('Message'),
  args: {
    channelUrl: stringArg(),
    number: nullable(stringArg()),
    cursorId: nullable(idArg()),
    lastVisitDate: nullable(stringArg())
  },
  resolve: async (_, { channelUrl, number, cursorId, lastVisitDate }, ctx) => {
    const userId = getUserId(ctx)

    let channelsInfo = null
    let lastReadedMessage = null
    if (!isEmpty(userId)) {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { currentChannel: { connect: { url: channelUrl! } } }
      })

      channelsInfo = await ctx.prisma.channelInfo.findMany({
        where: {
          user: { id: userId },
          channel: {
            url: channelUrl!
          }
        }
      })
      const lastUpdateDate = lastVisitDate || (channelsInfo[0] && channelsInfo[0].lastUpdateAt)
      lastReadedMessage = await ctx.prisma.message.findMany({
        where: {
          channel: { url: channelUrl! },
          OR: [{ createdAt: { equals: lastUpdateDate } }, { createdAt: { lt: lastUpdateDate } }]
        },
        take: 1
      })
    }

    const searchMessageId = cursorId || (lastReadedMessage && lastReadedMessage[0] && lastReadedMessage[0].id)

    if (!searchMessageId) {
      const messageList = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        include: { channel: true },
        take: Number(number) || messagesNumber
      })
      return messageList
    } else {
      const prevMessages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        include: { channel: true },
        take: -(Number(number) || messagesNumber),
        skip: 1,
        cursor: { id: searchMessageId }
      })

      const nextMessages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        include: { channel: true },
        take: Number(number) || messagesNumber,
        skip: 1,
        cursor: { id: searchMessageId }
      })

      const message = await ctx.prisma.message.findFirst({
        where: {
          id: searchMessageId
        },
        include: { channel: true }
      })

      const messageList = [].concat(prevMessages, [message], nextMessages)

      return messageList
    }
  }
})

export const prevMessages = queryField('getPrevMessages', {
  type: list('Message'),
  args: {
    channelUrl: stringArg(),
    number: nullable(stringArg()),
    cursorId: idArg()
  },
  resolve: async (_, { channelUrl, cursorId, number }, ctx) => {
    return ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl! } },
      take: -(Number(number) || messagesNumber),
      skip: 1,
      cursor: { id: cursorId }
    })
  }
})

export const nextMessages = queryField('getNextMessages', {
  type: list('Message'),
  args: {
    channelUrl: stringArg(),
    number: nullable(stringArg()),
    cursorId: idArg()
  },
  resolve: async (_, { channelUrl, cursorId, number }, ctx) => {
    return ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl! } },
      take: Number(number) || messagesNumber,
      skip: 1,
      cursor: { id: cursorId }
    })
  }
})

export const allMessages = queryField('allMessages', {
  type: list('Message'),
  args: {
    channelUrl: stringArg()
  },
  resolve: async (_, { channelUrl }, ctx) => {
    const messagesList = await ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl! } }
    })

    return messagesList
  }
})

export const searchMessages = queryField('searchMessages', {
  type: list('Message'),
  args: {
    channelUrl: stringArg(),
    searchQuery: stringArg()
  },
  resolve: async (_, { channelUrl, searchQuery }, ctx) => {
    if (!searchQuery || !searchQuery.length) throw new Error('search error')

    const messagesList = await ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl! }, body: { contains: searchQuery } }
    })

    return messagesList
  }
})

export const getUnreadMessagesCount = queryField('getUnreadMessagesCount', {
  type: 'UnreadMessagePayload',
  args: {
    username: stringArg(),
    channelUrl: stringArg()
  },
  resolve: async (_, { username, channelUrl }, ctx) => {
    const userId = await getUserId(ctx)
    let fromNewUser = false
    //get Other user info
    const user = await ctx.prisma.user.findFirst({
      where: { username }
    })

    // get my channelInfo
    const channelsInfo = await ctx.prisma.channelInfo.findMany({
      where: {
        user: { id: userId },
        channel: {
          url: channelUrl!
        }
      }
    })

    if (channelsInfo.length === 0) {
      fromNewUser = true
    }

    const lastUpdateDate = channelsInfo[0] && channelsInfo[0].lastUpdateAt
    const lastReadedMessage = await ctx.prisma.message.findMany({
      where: {
        channel: { url: channelUrl! },
        OR: [{ createdAt: { equals: lastUpdateDate } }, { createdAt: { lt: lastUpdateDate } }]
      },
      take: 1
    })

    const searchMessageId = lastReadedMessage[0] && lastReadedMessage[0].id

    //get my unread messages
    let messages

    if (!searchMessageId) {
      messages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl! } }
      })
    } else {
      messages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        cursor: { id: searchMessageId }
      })

      const message = await ctx.prisma.message.findFirst({
        where: {
          id: searchMessageId
        }
      })

      const prevMessages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        take: -1,
        skip: 1,
        cursor: { id: searchMessageId }
      })

      messages = [].concat([message], messages)
    }

    return {
      user,
      messages,
      fromNewUser
    }
  }
})
