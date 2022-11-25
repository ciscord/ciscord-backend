import { queryField, stringArg, idArg } from 'nexus'
import { getUserId } from '../../utils';

export const reactions = queryField('reactions', {
  type: 'Reaction',
  list: true,
  args: {
    messageId: stringArg(),
  },
  resolve: async (parrent, { messageId }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.reaction.findMany({
      where: { message: { id: messageId } },
    })
  },
})
