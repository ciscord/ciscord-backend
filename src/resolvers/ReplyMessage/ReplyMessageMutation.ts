import { mutationField, stringArg, list } from 'nexus'
import { getUserId, getTenant } from '../../utils'

export const replyMessage = mutationField('replyMessage', {
  type: 'ReplyMessage',
  args: {
    body: stringArg(),
    parentId: stringArg(),
    urlList: list(stringArg()),
  },
  resolve: async (parent, { body, parentId, urlList }, ctx) => {
    const userId = (await getUserId(ctx)) || 'ck3fot8rr0000qmkp16jlc1mq'
    if (!userId) {
      throw new Error('nonexistent user')
    }
    const data = {
      body,
      author: { connect: { id: userId } },
      parent: { connect: { id: parentId } },
      urlList,
    }

    const replyMessage = await ctx.prisma.replyMessage.create({
      data,
      include: {
        parent: { include: { channel: true, children: true, reactions: true } },
        author: true
      }
    })

    const _message = await ctx.prisma.message.findFirst({
      where: {
        id: replyMessage.parent.id
      },
      include: { author: true, channel: true, children: { include: {author: true}}, reactions: true }
    })

    ctx.pubsub.publish('EDITED_MESSAGE', {
      editMessage: _message,
      tenant: getTenant(ctx)
    })

    return replyMessage
  }
})

export const editReplyMessage = mutationField('editReplyMessage', {
  type: 'ReplyMessage',
  args: {
    body: stringArg(),
    messageId: stringArg()
  },
  resolve: async (parent, { body, messageId }, ctx) => {
    const userId = getUserId(ctx) || 'ck3fot8rr0000qmkp16jlc1mq'

    if (!userId) {
      throw new Error('nonexistent user')
    }

    const requestingUserIsAuthor = await ctx.prisma.replyMessage.findMany({
      where: {
        id: messageId,
        author: { id: userId }
      }
    })

    if (!requestingUserIsAuthor[0]) {
      throw new Error('Invalid permissions, you must be an author of this post to edit it.')
    }

    const message = await ctx.prisma.replyMessage.update({
      where: {
        id: messageId
      },
      data: {
        body
      },
      include: {
        parent: { include: { channel: true, children: { include: { author: true }}, reactions: true } },
        author: true
      }
    })

    const _message = await ctx.prisma.message.findFirst({
      where: {
        id: message.parent.id
      },
      include: { author: true, channel: true, children: { include: {author: true}}, reactions: true }
    })

    ctx.pubsub.publish('EDITED_MESSAGE', {
      editMessage: _message,
      tenant: getTenant(ctx)
    })

    return message
  }
})

export const deleteReplyMessage = mutationField('deleteReplyMessage', {
  type: 'ReplyMessage',
  args: {
    messageId: stringArg()
  },
  resolve: async (parent, { messageId }, ctx) => {
    const userId = getUserId(ctx) || 'ck3fot8rr0000qmkp16jlc1mq'

    if (!userId) {
      throw new Error('nonexistent user')
    }

    const requestingUserIsAuthor = await ctx.prisma.replyMessage.findMany({
      where: {
        id: messageId,
        author: { id: userId }
      },
    })

    if (!requestingUserIsAuthor[0]) {
      throw new Error('Invalid permissions, you must be an author of this post to delete it.')
    }

    const message = await ctx.prisma.replyMessage.delete({
      where: {
        id: messageId
      },
      include: {
        parent: { include: { channel: true, children: { include: { author: true }}, reactions: true } },
        author: true
      }
    })

    const _message = await ctx.prisma.message.findFirst({
      where: {
        id: message.parent.id
      },
      include: { author: true, channel: true, children: { include: {author: true}}, reactions: true }
    })

    ctx.pubsub.publish('EDITED_MESSAGE', {
      editMessage: _message,
      tenant: getTenant(ctx)
    })

    return message
  }
})
