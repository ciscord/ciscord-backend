import { queryField, stringArg, list } from 'nexus'
import { getUserId } from '../../utils';

export const reactions = queryField('reactions', {
  type: list('Reaction'),
  args: {
    messageId: stringArg(),
  },
  resolve: async (parrent, { messageId }, ctx) => {
    return ctx.prisma.reaction.findMany({
      where: { message: { id: messageId! } },
    })
  },
})
