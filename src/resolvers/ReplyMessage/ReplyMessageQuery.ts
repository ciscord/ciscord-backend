import { queryField, stringArg, idArg } from 'nexus'
import { getUserId } from '../../utils';

export const messages = queryField('replyMessages', {
  type: 'Message',
  list: true,
  args: {
    channelUrl: stringArg(),
    after: idArg({ nullable: true }),
  },
  resolve: async (_, { channelUrl, after }, ctx) => {

    return ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl } },
      after: { id: after }
    })
  },
})

export const messageReplies = queryField('messageReplies', {
  type: 'ReplyMessage',
  list: true,
  args: {
    messageId: stringArg(),
    after: idArg({ nullable: true }),
  },
  resolve: async (_, { messageId, after }, ctx) => {

    return ctx.prisma.replyMessage.findMany({
      where: { parent: { id: messageId } },
      after: { id: after }
    })
  },
})