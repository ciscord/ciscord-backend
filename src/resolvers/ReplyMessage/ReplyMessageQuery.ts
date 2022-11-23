import { queryField, stringArg, idArg, nullable } from 'nexus'
import { getUserId } from '../../utils';

export const messages = queryField('replyMessages', {
  type: 'Message',
  
  args: {
    channelUrl: stringArg(),
    after: nullable(idArg()),
  },
  resolve: async (_, { channelUrl, after }, Context) => {

    return Context.prisma.message.findMany({
      where: { channel: { url: channelUrl } },
      after: { id: after }
    })
  },
})

export const messageReplies = queryField('messageReplies', {
  type: 'ReplyMessage',
  
  args: {
    messageId: stringArg(),
    after: nullable(idArg()),
  },
  resolve: async (_, { messageId, after }, Context) => {

    return Context.prisma.replyMessage.findMany({
      where: { parent: { id: messageId } },
      after: { id: after }
    })
  },
})