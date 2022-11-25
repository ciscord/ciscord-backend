import { queryField, stringArg, idArg, nullable, list } from 'nexus'

export const messages = queryField('replyMessages', {
  type: list('Message'),
  
  args: {
    channelUrl: stringArg(),
    after: nullable(idArg()),
  },
  resolve: async (_, { channelUrl, after }, Context) => {

    return Context.prisma.message.findMany({
      where: { channel: { url: channelUrl! } },
      cursor: { id: after! }
    })
  },
})

export const messageReplies = queryField('messageReplies', {
  type: list('ReplyMessage'),
  
  args: {
    messageId: stringArg(),
    after: nullable(idArg()),
  },
  resolve: async (_, { messageId, after }, Context) => {

    return Context.prisma.replyMessage.findMany({
      where: { parent: { id: messageId! } },
      cursor: { id: after! }
    })
  },
})