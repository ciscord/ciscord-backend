import { queryField, stringArg, idArg } from 'nexus'
import { getUserId } from '../../utils';

export const reactions = queryField('reactions', {
  type: 'Reaction',
  
  args: {
    messageId: stringArg(),
  },
  resolve: async (parrent, { messageId }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.reaction.findMany({
      where: { message: { id: messageId } },
    })
  },
})
