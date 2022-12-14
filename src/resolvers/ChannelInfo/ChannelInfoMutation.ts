import { mutationField, stringArg, nonNull } from 'nexus'
import { getUserId } from '../../utils'

export const updateChannelInfo = mutationField('updateChannelInfo', {
  type: 'User',
  args: {
    channelUrl: nonNull(stringArg()),
    date: nonNull(stringArg())
  },
  resolve: async (_parent, { channelUrl, date }, ctx) => {
    const userId = await getUserId(ctx)
    if (!userId) {
      throw new Error('nonexistent user')
    }
    const user = await ctx.prisma.user.findFirst({
      where: { id: userId },
      include: { channelsInfo: { include: { channel: true } } }
    })

    const channel = await ctx.prisma.channel.findFirst({
      where: {
        url: channelUrl
      }
    })

    if (!channel) throw new Error('nonexistent channel ')

    const channelsInfo = await ctx.prisma.channelInfo.findMany({
      where: {
        channel: { url: channelUrl },
        user: { id: userId }
      },
      include: {
        channel: true,
        user: true
      }
    })

    if (channelsInfo.length > 0) {
      const channelInfo = channelsInfo[0]

      if (channelInfo && new Date(channelInfo.lastUpdateAt).getTime() > new Date(date).getTime()) {
        return user
      }
    }

    const res = await ctx.prisma.channelInfo.upsert({
      where: {
        uniqueUserChannelPair: `${user!.username}:${channel.url}`
      },
      create: {
        channel: { connect: { id: channel.id } },
        user: { connect: { id: userId } },
        uniqueUserChannelPair: `${user!.username}:${channel.url}`
      },
      update: {
        lastUpdateAt: new Date(date)
      },
      include: {
        user: true,
        channel: true
      }
    })

    const index = user!.channelsInfo.findIndex(({ id }) => id === res.id)
    const newInfos = user!.channelsInfo
    newInfos[index] = res

    return { ...user, channelsInfo: [...newInfos] }
  }
})
