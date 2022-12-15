import { mutationField, stringArg, booleanArg } from 'nexus'
import { Context } from '../../context'
import { getTenant, getUserId } from '../../utils'

export const setUserTypingStatus = mutationField('setUserTypingStatus', {
  type: 'TypingStatus',
  args: { channelUrl: stringArg(), isTyping: booleanArg() },
  resolve: async (_, { channelUrl, isTyping }, ctx: Context): Promise<any> => {
    const userId = await getUserId(ctx)
    if (!userId) {
      throw new Error('nonexistent user')
    }
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    ctx.pubsub.publish('USER_TYPING_STATUS', {
      userTypingStatus: {
        username: user!.username,
        tenant: await getTenant(ctx),
        isTyping,
        channelUrl
      }
    })

    return {
      username: user!.username,
      isTyping
    }
  }
})
