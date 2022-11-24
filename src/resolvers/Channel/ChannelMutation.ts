import { mutationField, stringArg, booleanArg, nullable } from 'nexus'
import { getUserId } from '../../utils'
import { Channel } from '../index';

export const createChannel = mutationField('createChannel', {
  type: Channel,
  args: {
    name: stringArg(),
    description: nullable(stringArg()),
    url: stringArg(),
    isPrivate: nullable(booleanArg()),
    communityUrl: stringArg()
  },
  resolve: async (
    parent,
    { name, url, description, isPrivate, communityUrl },
    Context
  ) => {
    const userId = getUserId(Context)
    return Context.prisma.channel.create({
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
  type: Channel,
  args: {
    channelId: stringArg(),
    name: stringArg(),
    description: nullable(stringArg())
  },
  resolve: async (parent, { channelId, name, description }, Context) => {
    const userId = getUserId(Context)
    return Context.prisma.channel.update({
      where: { id: channelId },
      data: {
        name,
        description
      }
    })
  }
})
