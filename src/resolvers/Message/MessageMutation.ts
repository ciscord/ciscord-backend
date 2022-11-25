import { mutationField, stringArg, arg } from 'nexus'
import { getUserId, getTenant } from '../../utils'
import { processUpload, deleteFromAws } from '../../utils/fileApi'
import { removeFile, getOpenGraphData, createRemoteAttachments } from '../../utils/helpers'

export const sendMessage = mutationField('sendMessage', {
  type: 'Message',
  args: {
    body: stringArg(),
    attachments: stringArg({ list: true, nullable: true }),
    channelUrl: stringArg(),
    urlList: stringArg({ list: true, nullable: true }),
    mentions: stringArg({ list: true, nullable: true }),
    communityUrl: stringArg()
  },
  resolve: async (parent, { body, channelUrl, attachments, urlList, mentions, communityUrl }, ctx) => {
    try {
      const userId = await getUserId(ctx)

      const data = {
        body,
        author: { connect: { id: userId } },
        channel: { connect: { url: channelUrl } },
        attachments: {},
        remoteAttachments: await createRemoteAttachments(urlList)
      }

      if (attachments) {
        data.attachments = {
          connect: attachments.map((Key: string) => ({
            Key
          }))
        }
      }

      const message = await ctx.prisma.message.create({
        data,
        include: {
          channel: true,
          reactions: true,
          children: true,
          attachments: true
        }
      })
      await ctx.pubsub.publish('NEW_MESSAGE', {
        newMessage: message,
        tenant: getTenant(ctx)
      })

      await ctx.pubsub.publish('CHANNEL_NEW_MESSAGE', {
        channelNewMessage: {
          ...message.channel,
        },
        tenant: getTenant(ctx)
      })

      //upsert his channelinfo
      const user = await ctx.prisma.user.findOne({
        where: { id: userId },
        include: { channelsInfo: { include: { channel: true } } }
      });
      await ctx.prisma.channelInfo.upsert({
        where: {
          uniqueUserChannelPair: `${user.username}:${channelUrl}`
        },
        create: {
          channel: { connect: { url: channelUrl } },
          user: { connect: { id: userId } },
          uniqueUserChannelPair: `${user.username}:${channelUrl}`,
        },
        update: {
          lastUpdateAt: new Date(message.createdAt)
        },
      });


      mentions.map(async (mention: any) => {
        const notification = await ctx.prisma.notification.create({
          data: {
            type: 'mention',
            sender: { connect: { id: userId } },
            receiver: { connect: { username: mention } },
            message: { connect: { id: message.id } },
            channel: { connect: { url: channelUrl } },
            community: { connect: { url: communityUrl } }
          },
          include: {
            sender: true,
            receiver: true,
            message: true,
            channel: true
          }
        })
        ctx.pubsub.publish('NEW_NOTIFICATION', {
          newNotification: notification,
          tenant: getTenant(ctx)
        })
      })

      if (communityUrl === 'direct') {
        // update channel createdAt (we will use createAt like the updatedAt lastmessage for private chat sort function)
        ctx.prisma.channel.update({
          where: { url: channelUrl },
          data: {
            createdAt: new Date()
          }
        })

        // ----- get other user and create the notification for private chat
        const channelUsernames = channelUrl.replace('direct/', '').split('-')
        
        const user1 = await ctx.prisma.user.findOne({
          where: {
            username: channelUsernames[0]
          },
          include: {
            currentChannel: true
          }
        })

        const user2 = await ctx.prisma.user.findOne({
          where: {
            username: channelUsernames[1]
          },
          include: {
            currentChannel: true
          }
        })

        if (user1 && user2) {
          let otherUser = user1.id === userId ? user2 : user1

          if (otherUser.currentChannel && otherUser.currentChannel.url !== channelUrl) {
            const notification = await ctx.prisma.notification.create({
              data: {
                type: 'direct',
                sender: { connect: { id: userId } },
                receiver: { connect: { username: otherUser.username } },
                message: { connect: { id: message.id } },
                channel: { connect: { url: channelUrl } },
                community: { connect: { url: communityUrl } }
              },
              include: {
                sender: true,
                receiver: true,
                message: true,
                channel: true
              }
            })
            ctx.pubsub.publish('NEW_NOTIFICATION', {
              newNotification: notification,
              tenant: getTenant(ctx)
            })
          }
        }
      }

      return message
    } catch (error) {
      console.log(error)
    }
  }
})

export const editMessage = mutationField('editMessage', {
  type: 'Message',
  args: {
    body: stringArg(),
    messageId: stringArg()
  },
  resolve: async (parent, { body, messageId }, ctx) => {
    const userId = getUserId(ctx)

    if (!userId) {
      throw new Error('nonexistent user')
    }

    const requestingUserIsAuthor = await ctx.prisma.message.findMany({
      where: {
        id: messageId
      }
    })

    if (!requestingUserIsAuthor[0]) {
      throw new Error('Invalid permissions, you must be an author of this post to edit it.')
    }

    const message = await ctx.prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        body
      },
      include: {
        channel: true,
        reactions: true,
        children: true,
        attachments: true
      }
    })

    ctx.pubsub.publish('EDITED_MESSAGE', {
      editMessage: message,
      tenant: getTenant(ctx)
    })

    return message
  }
})

export const deleteMessage = mutationField('deleteMessage', {
  type: 'Message',
  args: {
    messageId: stringArg()
  },
  resolve: async (parent, { messageId }, ctx) => {
    const userId = getUserId(ctx)

    if (!userId) {
      throw new Error('nonexistent user')
    }

    const currentMessage = await ctx.prisma.message.findMany({
      where: {
        id: messageId
      },
      include: {
        attachments: true,
        children: { include: { attachments: true } }
      }
    })

    if (currentMessage.length === 0) {
      throw new Error('There is no message')
    }

    /*Cascading deletes are not yet implemented*/
    await ctx.prisma.reaction.deleteMany({
      where: {
        message: {
          id: messageId
        }
      }
    })

    const repliesAttachments = currentMessage[0].children
      .map(({ attachments }) => attachments.map(({ Key }) => Key))
      .filter(item => item.length)

    const messageFiles = currentMessage[0].attachments.map(({ Key }) => Key)

    const filesList = [].concat(...repliesAttachments, messageFiles)

    await removeFile({ filesList, ctx, messageId })

    await ctx.prisma.replyMessage.deleteMany({
      where: {
        parent: {
          id: messageId
        }
      }
    })

    /*Cascading deletes are not yet implemented*/

    const message = await ctx.prisma.message.delete({
      where: {
        id: messageId
      },
      include: {
        channel: true,
        reactions: true
      }
    })

    ctx.pubsub.publish('DELETED_MESSAGE', {
      deleteMessage: message,
      tenant: getTenant(ctx)
    })

    return message
  }
})

export const searchMessages = mutationField('searchMessages', {
  type: 'Message',
  list: true,
  args: {
    channelUrl: stringArg(),
    searchQuery: stringArg()
  },
  resolve: async (_, { channelUrl, searchQuery }, ctx) => {
    if (!searchQuery || !searchQuery.length) throw new Error('search error')

    const userId = await getUserId(ctx)

    const messagesList = await ctx.prisma.message.findMany({
      where: { channel: { url: channelUrl }, body: { contains: searchQuery } }
    })

    return messagesList
  }
})
