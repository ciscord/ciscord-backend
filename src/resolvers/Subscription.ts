import { objectType, stringArg } from 'nexus'
import { filter, pipe } from 'graphql-yoga'
import ReactionSubscriptions from './Reaction/ReactionSubscriptions'

export const Subscription = objectType({
  name: 'Subscription',
  definition(t) {
    t.field('newMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.pubsub.asyncIterator('NEW_MESSAGE'),
          filter((payload) => payload.message.channel.url === channelUrl)
        )
      },
      resolve: (payload) => {
        return payload.message
      }
    })

    t.field('editMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.pubsub.asyncIterator('EDITED_MESSAGE'),
          filter((payload) => payload.editMessage.channel.url === channelUrl)
        )
      }
    })

    t.field('deleteMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.pubsub.asyncIterator('DELETED_MESSAGE'),
          filter((payload) => payload.deleteMessage.channel.url === channelUrl)
        )
      }
    })

    t.field('newNotification', {
      type: 'Notification',
      args: { receiverId: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.pubsub.asyncIterator('NEW_NOTIFICATION'),
          filter((payload) => payload.newNotification.channel.url === channelUrl)
        )
      }
    })

    t.field('channelNewMessage', {
      type: 'Channel',
      args: { communityUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        console.log(channelUrl, tenant, '===channelNewMessage====')
        return pipe(
          context.pubsub.asyncIterator('CHANNEL_NEW_MESSAGE'),
          filter((payload) => payload.channelNewMessage.channel.url === channelUrl)
        )
      }
    })

    t.field('userWentOnline', {
      type: 'User',
      args: { tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.pubsub.asyncIterator('USER_WENT_ONLINE'),
          filter((payload) => payload.tenant === tenant)
        )
      },
      resolve: (payload) => {
        return payload.user
      }
    })

    t.field('userWentOffline', {
      type: 'User',
      args: { tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.pubsub.asyncIterator('USER_WENT_OFFLINE'),
          filter((payload) => payload.tenant === tenant)
        )
      },
      resolve: (payload) => {
        return payload.user
      }
    })

    t.field('userTypingStatus', {
      type: 'TypingStatus',
      args: {
        channelUrl: stringArg(),
        tenant: stringArg(),
        username: stringArg()
      },

      subscribe: ({ userTypingStatus }, { channelUrl, tenant, username }, context) => {
        return pipe(
          context.pubsub.asyncIterator('USER_TYPING_STATUS'),
          filter(
            (payload) =>
              channelUrl === userTypingStatus.channelUrl &&
              userTypingStatus.tenant === tenant &&
              userTypingStatus.username !== username
          )
        )
      }
    })

    ReactionSubscriptions(t)
  }
})
