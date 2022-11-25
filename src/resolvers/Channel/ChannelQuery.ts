import { queryField, stringArg, list } from 'nexus'
import { getUserId, getTenant } from '../../utils'

export const channels = queryField('channels', {
  type: list('Channel'),

  args: { communityUrl: stringArg() },
  resolve: (parent, { communityUrl }, Context) => {
    return Context.prisma.channel.findMany({
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
  type: list('Channel'),

  args: {
    url: stringArg()
  },
  resolve: (parent, { url }, Context) => {
    return Context.prisma.channel.findFirst({
      where: { url }
    })
  }
})

export const privateChannels = queryField('privateChannels', {
  type: list('Channel'),

  resolve: async (_parent, {}, Context) => {
    const userId = await getUserId(Context)

    const user = await Context.prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    const searchString = 'direct/'
    const searchString1 = user.username + '-'

    const channels = await Context.prisma.channel.findMany({
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
