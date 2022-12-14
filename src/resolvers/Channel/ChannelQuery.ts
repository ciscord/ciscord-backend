import { queryField, stringArg, list, nonNull } from 'nexus'
import { getUserId } from '../../utils'

export const channels = queryField('channels', {
  type: list('Channel'),
  args: { communityUrl: nonNull(stringArg()) },
  resolve: (parent, { communityUrl }, ctx) => {
    return ctx.prisma.channel.findMany({
      where: {
        community: {
          url: communityUrl
        }
      },
      orderBy: { createdAt: 'asc' }
    })
  }
})

export const channel = queryField('channel', {
  type: 'Channel',
  args: {
    url: nonNull(stringArg())
  },
  resolve: (parent, { url }, ctx) => {
    return ctx.prisma.channel.findFirst({
      where: { url }
    })
  }
})

export const privateChannels = queryField('privateChannels', {
  type: list('Channel'),
  resolve: async (_parent, {}, ctx) => {
    const userId = await getUserId(ctx)
    if (!userId) {
      throw new Error('nonexistent user')
    }
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    const searchString = 'direct/'
    const searchString1 = user!.username + '-'

    const channels = await ctx.prisma.channel.findMany({
      where: {
        AND: [{ url: { contains: searchString } }, { url: { contains: searchString1 } }]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return channels
  }
})
