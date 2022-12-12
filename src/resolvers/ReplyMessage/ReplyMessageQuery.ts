import { queryField, stringArg, idArg, nullable, list } from 'nexus'

export const messages = queryField('replyMessages', {
  type: list('Message'),
  args: {
    channelUrl: stringArg(),
    after: nullable(idArg()),
  },
  resolve: async (_, { channelUrl, after }, ctx) => {

    return ctx.prisma.message.findMany({
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
  resolve: async (_, { messageId, after }, ctx) => {

    return ctx.prisma.replyMessage.findMany({
      where: { parent: { id: messageId! } },
      cursor: { id: after! }
    })
  },
})