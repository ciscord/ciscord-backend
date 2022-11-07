import { queryField, stringArg, idArg } from 'nexus'
import { getUserId, isEmpty } from '../../utils'

const messagesNumber = 30

export const lastMessages = queryField('getLastMessages', {
  type: 'Message',
  list: true,
  args: {
    channelUrl: stringArg(),
    number: stringArg({ nullable: true }),
    cursorId: idArg({ nullable: true }),
    lastVisitDate: stringArg({ nullable: true })
  },
  resolve: async (_, { channelUrl, number, cursorId, lastVisitDate }, ctx) => {
    const userId: string = getUserId(ctx);

    let channelsInfo = null;
    let lastReadedMessage = null;
    if (!isEmpty(userId)) {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { currentChannel: { connect: { url: channelUrl } } }
      })


      channelsInfo = await ctx.prisma.channelInfo.findMany({
        where: {
          user: { id: userId },
          channel: {
            url: channelUrl
          }
        }
      })

      const lastUpdateDate = lastVisitDate || (channelsInfo[0] && channelsInfo[0].lastUpdateAt)
      lastReadedMessage = await ctx.prisma.message.findMany({
        where: {
          channel: { url: channelUrl },
          OR: [{ createdAt: { equals: lastUpdateDate } }, { createdAt: { lt: lastUpdateDate } }]
        },
        last: 1
      })
    }


    const searchMessageId = cursorId || (lastReadedMessage && lastReadedMessage[0] && lastReadedMessage[0].id)

    if (!searchMessageId) {
      return ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        include: { channel: true },
        last: Number(number) || messagesNumber
      })
    } else {
      const prevMessages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        include: { channel: true },
        last: Number(number) || messagesNumber,
        before: {id: searchMessageId}
      })

      const nextMessages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        include: { channel: true },
        first: Number(number) || messagesNumber,
        after: {id: searchMessageId}
      })

      const message = await ctx.prisma.message.findOne({
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
  type: 'Message',
  list: true,
  args: {
    channelUrl: stringArg(),
    number: stringArg({ nullable: true }),
    cursorId: idArg()
  },
  resolve: async (_, { channelUrl, cursorId, number }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl } },
      last: Number(number) || messagesNumber,
      before: {id: cursorId}
    })
  }
})

export const nextMessages = queryField('getNextMessages', {
  type: 'Message',
  list: true,
  args: {
    channelUrl: stringArg(),
    number: stringArg({ nullable: true }),
    cursorId: idArg()
  },
  resolve: async (_, { channelUrl, cursorId, number }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl } },
      first: Number(number) || messagesNumber,
      after: {id: cursorId}
    })
  }
})

export const allMessages = queryField('allMessages', {
  type: 'Message',
  list: true,
  args: {
    channelUrl: stringArg()
  },
  resolve: async (_, { channelUrl }, ctx) => {
    const userId = await getUserId(ctx)

    const messagesList = await ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl } }
    })

    return messagesList
  }
})

export const searchMessages = queryField('searchMessages', {
  type: 'Message',
  list: true,
  args: {
    channelUrl: stringArg(),
    searchQuery: stringArg()
  },
  resolve: async (_, { channelUrl, searchQuery }, ctx) => {
    if (!searchQuery || !searchQuery.length) throw new Error('search error')

    const userId = await getUserId(ctx)

    const messagesList = await ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl }, body: { contains: searchQuery } }
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
    const user = await ctx.prisma.user.findOne({
      where: { username }
    })

    // get my channelInfo
    const channelsInfo = await ctx.prisma.channelInfo.findMany({
      where: {
        user: { id: userId },
        channel: {
          url: channelUrl
        }
      }
    })

    if (channelsInfo.length === 0) {
      fromNewUser = true
    }

    const lastUpdateDate = channelsInfo[0] && channelsInfo[0].lastUpdateAt
    const lastReadedMessage = await ctx.prisma.message.findMany({
      where: {
        channel: { url: channelUrl },
        OR: [{ createdAt: { equals: lastUpdateDate } }, { createdAt: { lt: lastUpdateDate } }]
      },
      last: 1
    })

    const searchMessageId = lastReadedMessage[0] && lastReadedMessage[0].id

    //get my unread messages
    let messages

    if (!searchMessageId) {
      messages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl } }
      })
    } else {
      messages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        after: {id: searchMessageId}
      })

      const message = await ctx.prisma.message.findOne({
        where: {
          id: searchMessageId
        }
      })

      const prevMessages = await ctx.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        last: 1,
        before: {id: searchMessageId}
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
