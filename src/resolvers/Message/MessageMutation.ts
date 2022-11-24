import { mutationField, stringArg, nullable } from 'nexus'
import { getUserId, getTenant } from '../../utils';
import { removeFile, getOpenGraphData, createRemoteAttachments } from '../../utils/helpers';
import { Message } from '../index';

export const sendMessage = mutationField('sendMessage', {
  type: Message,
  args: {
    body: stringArg(),
    attachments: nullable(stringArg()),
    channelUrl: stringArg(),
    urlList: nullable(stringArg()),
    mentions: nullable(stringArg()),
    communityUrl: stringArg()
  },
  resolve: async (parent, { body, channelUrl, attachments, urlList, mentions, communityUrl }, Context) => {
    try {
      const userId = await getUserId(Context)

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

      const message = await Context.prisma.message.create({
        data,
        include: {
          channel: true,
          reactions: true,
          children: true,
          attachments: true
        }
      })
      await Context.pubsub.publish('NEW_MESSAGE', {
        newMessage: message,
        tenant: getTenant(Context)
      })

      await Context.pubsub.publish('CHANNEL_NEW_MESSAGE', {
        channelNewMessage: {
          ...message.channel,
        },
        tenant: getTenant(Context)
      })

      //upsert his channelinfo
      const user = await Context.prisma.user.findOne({
        where: { id: userId },
        include: { channelsInfo: { include: { channel: true } } }
      });
      await Context.prisma.channelInfo.upsert({
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
        const notification = await Context.prisma.notification.create({
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
        Context.pubsub.publish('NEW_NOTIFICATION', {
          newNotification: notification,
          tenant: getTenant(Context)
        })
      })

      if (communityUrl === 'direct') {
        // update channel createdAt (we will use createAt like the updatedAt lastmessage for private chat sort function)
        Context.prisma.channel.update({
          where: { url: channelUrl },
          data: {
            createdAt: new Date()
          }
        })

        // ----- get other user and create the notification for private chat
        const channelUsernames = channelUrl.replace('direct/', '').split('-')
        
        const user1 = await Context.prisma.user.findOne({
          where: {
            username: channelUsernames[0]
          },
          include: {
            currentChannel: true
          }
        })

        const user2 = await Context.prisma.user.findOne({
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
            const notification = await Context.prisma.notification.create({
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
            Context.pubsub.publish('NEW_NOTIFICATION', {
              newNotification: notification,
              tenant: getTenant(Context)
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
  type: Message,
  args: {
    body: stringArg(),
    messageId: stringArg()
  },
  resolve: async (parent, { body, messageId }, Context) => {
    const userId = getUserId(Context)

    if (!userId) {
      throw new Error('nonexistent user')
    }

    const requestingUserIsAuthor = await Context.prisma.message.findMany({
      where: {
        id: messageId
      }
    })

    if (!requestingUserIsAuthor[0]) {
      throw new Error('Invalid permissions, you must be an author of this post to edit it.')
    }

    const message = await Context.prisma.message.update({
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

    Context.pubsub.publish('EDITED_MESSAGE', {
      editMessage: message,
      tenant: getTenant(Context)
    })

    return message
  }
})

export const deleteMessage = mutationField('deleteMessage', {
  type: Message,
  args: {
    messageId: stringArg()
  },
  resolve: async (parent, { messageId }, Context) => {
    const userId = getUserId(Context)

    if (!userId) {
      throw new Error('nonexistent user')
    }

    const currentMessage = await Context.prisma.message.findMany({
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
    await Context.prisma.reaction.deleteMany({
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

    await removeFile({ filesList, Context, messageId })

    await Context.prisma.replyMessage.deleteMany({
      where: {
        parent: {
          id: messageId
        }
      }
    })

    /*Cascading deletes are not yet implemented*/

    const message = await Context.prisma.message.delete({
      where: {
        id: messageId
      },
      include: {
        channel: true,
        reactions: true
      }
    })

    Context.pubsub.publish('DELETED_MESSAGE', {
      deleteMessage: message,
      tenant: getTenant(Context)
    })

    return message
  }
})

export const searchMessages = mutationField('searchMessages', {
  type: Message,
  
  args: {
    channelUrl: stringArg(),
    searchQuery: stringArg()
  },
  resolve: async (_, { channelUrl, searchQuery }, Context) => {
    if (!searchQuery || !searchQuery.length) throw new Error('search error')

    const userId = await getUserId(Context)

    const messagesList = await Context.prisma.message.findMany({
      where: { channel: { url: channelUrl }, body: { contains: searchQuery } }
    })

    return messagesList
  }
})
