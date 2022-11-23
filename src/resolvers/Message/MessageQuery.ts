import { queryField, stringArg, idArg, nullable } from 'nexus'
import { getUserId, isEmpty } from '../../utils'

const messagesNumber = 30

export const lastMessages = queryField('getLastMessages', {
  type: 'Message',
  
  args: {
    channelUrl: stringArg(),
    number: nullable(stringArg()),
    cursorId: nullable(idArg()),
    lastVisitDate: nullable(stringArg())
  },
  resolve: async (_, { channelUrl, number, cursorId, lastVisitDate }, Context) => {
    const userId: string = getUserId(Context);

    let channelsInfo = null;
    let lastReadedMessage = null;
    if (!isEmpty(userId)) {
      await Context.prisma.user.update({
        where: { id: userId },
        data: { currentChannel: { connect: { url: channelUrl } } }
      })


      channelsInfo = await Context.prisma.channelInfo.findMany({
        where: {
          user: { id: userId },
          channel: {
            url: channelUrl
          }
        }
      })

      const lastUpdateDate = lastVisitDate || (channelsInfo[0] && channelsInfo[0].lastUpdateAt)
      lastReadedMessage = await Context.prisma.message.findMany({
        where: {
          channel: { url: channelUrl },
          OR: [{ createdAt: { equals: lastUpdateDate } }, { createdAt: { lt: lastUpdateDate } }]
        },
        last: 1
      })
    }


    const searchMessageId = cursorId || (lastReadedMessage && lastReadedMessage[0] && lastReadedMessage[0].id)

    if (!searchMessageId) {
      return Context.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        include: { channel: true },
        last: Number(number) || messagesNumber
      })
    } else {
      const prevMessages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        include: { channel: true },
        last: Number(number) || messagesNumber,
        before: {id: searchMessageId}
      })

      const nextMessages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        include: { channel: true },
        first: Number(number) || messagesNumber,
        after: {id: searchMessageId}
      })

      const message = await Context.prisma.message.findOne({
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
  
  args: {
    channelUrl: stringArg(),
    number: nullable(stringArg()),
    cursorId: idArg()
  },
  resolve: async (_, { channelUrl, cursorId, number }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.message.findMany({
      where: { channel: { url: channelUrl } },
      last: Number(number) || messagesNumber,
      before: {id: cursorId}
    })
  }
})

export const nextMessages = queryField('getNextMessages', {
  type: 'Message',
  
  args: {
    channelUrl: stringArg(),
    number: nullable(stringArg()),
    cursorId: idArg()
  },
  resolve: async (_, { channelUrl, cursorId, number }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.message.findMany({
      where: { channel: { url: channelUrl } },
      first: Number(number) || messagesNumber,
      after: {id: cursorId}
    })
  }
})

export const allMessages = queryField('allMessages', {
  type: 'Message',
  
  args: {
    channelUrl: stringArg()
  },
  resolve: async (_, { channelUrl }, Context) => {
    const userId = await getUserId(Context)

    const messagesList = await Context.prisma.message.findMany({
      where: { channel: { url: channelUrl } }
    })

    return messagesList
  }
})

export const searchMessages = queryField('searchMessages', {
  type: 'Message',
  
  args: {
    channelUrl: stringArg(),
    searchQuery: stringArg()
  },
  resolve: async (_, { channelUrl, searchQuery }, Context) => {
    if (!searchQuery || !searchQuery.length) throw new Error('search error')

    const userId = await getUserId(Context)

    const messagesList = await Context.prisma.message.findMany({
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
  resolve: async (_, { username, channelUrl }, Context) => {
    const userId = await getUserId(Context)
    let fromNewUser = false
    //get Other user info
    const user = await Context.prisma.user.findOne({
      where: { username }
    })

    // get my channelInfo
    const channelsInfo = await Context.prisma.channelInfo.findMany({
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
    const lastReadedMessage = await Context.prisma.message.findMany({
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
      messages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl } }
      })
    } else {
      messages = await Context.prisma.message.findMany({
        where: { channel: { url: channelUrl } },
        after: {id: searchMessageId}
      })

      const message = await Context.prisma.message.findOne({
        where: {
          id: searchMessageId
        }
      })

      const prevMessages = await Context.prisma.message.findMany({
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
