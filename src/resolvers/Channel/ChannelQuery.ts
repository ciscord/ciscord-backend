import { queryField, stringArg } from 'nexus'
import { getUserId, getTenant } from '../../utils'

export const channels = queryField('channels', {
  type: 'Channel',
  list: true,
  args: { communityUrl: stringArg() },
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
  nullable: true,
  args: {
    url: stringArg()
  },
  resolve: (parent, { url }, ctx) => {
    return ctx.prisma.channel.findOne({
      where: { url }
    })
  }
})

export const privateChannels = queryField('privateChannels', {
  type: 'Channel',
  list: true,
  resolve: async (_parent, {}, ctx) => {
    const userId = await getUserId(ctx)

    const user = await ctx.prisma.user.findOne({
      where: {
        id: userId
      }
    })

    const searchString = 'direct/'
    const searchString1 = user.username + '-'

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
