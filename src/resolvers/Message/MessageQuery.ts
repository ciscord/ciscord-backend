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
  resolve: async (_, { channelUrl, number, cursorId, lastVisitDate }, Context) => {
    const userId = getUserId(Context);

    let channelsInfo = null;
    let lastReadedMessage = null;
    if (!isEmpty(userId)) {
      console.log(userId, '====userId channel')
      await Context.prisma.user.update({
        where: { id: userId },
        data: { currentChannel: { connect: { url: channelUrl! } } }
      })
      console.log('====updated channel')

      channelsInfo = await Context.prisma.channelInfo.findMany({
        where: {
          user: { id: userId },
          channel: {
            url: channelUrl!
          }
        }
      })
      console.log(channelsInfo, '====channelsInfo channel')
      const lastUpdateDate = lastVisitDate || (channelsInfo[0] && channelsInfo[0].lastUpdateAt)
      lastReadedMessage = await Context.prisma.message.findMany({
        where: {
          channel: { url: channelUrl! },
          OR: [{ createdAt: { equals: lastUpdateDate } }, { createdAt: { lt: lastUpdateDate } }]
        },
        take: 1
      })
    }

    console.log(lastReadedMessage, '====lastUpdateDate channel')
    const searchMessageId = cursorId || (lastReadedMessage && lastReadedMessage[0] && lastReadedMessage[0].id)

    if (!searchMessageId) {
      const messageList = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        include: { channel: true },
        take: Number(number) || messagesNumber
      })
      console.log(messageList, '====messageList channel')
      return messageList;
    } else {
      const prevMessages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        include: { channel: true },
        take: -(Number(number) || messagesNumber),
        skip: 1,
        cursor: {id: searchMessageId}
      })

      const nextMessages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        include: { channel: true },
        take: Number(number) || messagesNumber,
        skip: 1,
        cursor: {id: searchMessageId}
      })

      const message = await Context.prisma.message.findFirst({
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
  resolve: async (_, { channelUrl, cursorId, number }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.message.findMany({
      where: { channel: { url: channelUrl! } },
      take: -(Number(number) || messagesNumber),
      skip: 1,
      cursor: {id: cursorId}
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
  resolve: async (_, { channelUrl, cursorId, number }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.message.findMany({
      where: { channel: { url: channelUrl! } },
      take: Number(number) || messagesNumber,
      skip: 1,
      cursor: {id: cursorId}
    })
  }
})

export const allMessages = queryField('allMessages', {
  type: list('Message'),
  
  args: {
    channelUrl: stringArg()
  },
  resolve: async (_, { channelUrl }, Context) => {
    const userId = await getUserId(Context)

    const messagesList = await Context.prisma.message.findMany({
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
  resolve: async (_, { channelUrl, searchQuery }, Context) => {
    if (!searchQuery || !searchQuery.length) throw new Error('search error')

    const userId = await getUserId(Context)

    const messagesList = await Context.prisma.message.findMany({
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
  resolve: async (_, { username, channelUrl }, Context) => {
    const userId = await getUserId(Context)
    let fromNewUser = false
    //get Other user info
    const user = await Context.prisma.user.findFirst({
      where: { username }
    })

    // get my channelInfo
    const channelsInfo = await Context.prisma.channelInfo.findMany({
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
    const lastReadedMessage = await Context.prisma.message.findMany({
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
      messages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl! } }
      })
    } else {
      messages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        cursor: {id: searchMessageId}
      })

      const message = await Context.prisma.message.findFirst({
        where: {
          id: searchMessageId
        }
      })

      const prevMessages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl! } },
        take: -1,
        skip: 1,
        cursor: {id: searchMessageId}
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
