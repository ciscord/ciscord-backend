import { mutationField, stringArg, booleanArg } from 'nexus'
import { getUserId } from '../../utils'

export const createChannel = mutationField('createChannel', {
  type: 'Channel',
  args: {
    name: stringArg(),
    description: stringArg({ nullable: true }),
    url: stringArg(),
    isPrivate: booleanArg({ nullable: true }),
    communityUrl: stringArg()
  },
  resolve: async (
    parent,
    { name, url, description, isPrivate, communityUrl },
    ctx
  ) => {
    const userId = getUserId(ctx)
    return ctx.prisma.channel.create({
      data: {
        name,
        url,
        description,
        isPrivate,
        author: { connect: { id: userId } },
        community: { connect: { url: communityUrl } }
      }
    })
  }
})

export const editChannel = mutationField('editChannel', {
  type: 'Channel',
  args: {
    channelId: stringArg(),
    name: stringArg(),
    description: stringArg({ nullable: true })
  },
  resolve: async (parent, { channelId, name, description }, ctx) => {
    const userId = getUserId(ctx)
    return ctx.prisma.channel.update({
      where: { id: channelId },
      data: {
        name,
        description
      }
    })
  }
})
