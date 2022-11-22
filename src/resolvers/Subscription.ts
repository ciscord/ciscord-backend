import { objectType } from 'nexus'
import { filter, pipe } from 'graphql-yoga'
import { stringArg } from 'nexus'
import ReactionSubscriptions from './Reaction/ReactionSubscriptions'

export const Subscription = objectType({
  name: 'Subscription',
  definition(t) {
    t.field('newMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.subscribe('NEW_MESSAGE'),
          filter((payload) => payload.newMessage.channel.url === channelUrl && payload.tenant === tenant)
        )
      },
      resolve: (payload) => {
        return payload.newMessage
      }
    })

    t.field('editMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.subscribe('EDITED_MESSAGE'),
          filter((payload) => payload.editMessage.channel.url === channelUrl && payload.tenant === tenant)
        )
      }
    })

    t.field('deleteMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.subscribe('DELETED_MESSAGE'),
          filter((payload) => payload.deleteMessage.channel.url === channelUrl && payload.tenant === tenant)
        )
      }
    })

    t.field('newNotification', {
      type: 'Notification',
      args: { receiverId: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.subscribe('NEW_NOTIFICATION'),
          filter((payload) => payload.newNotification.channel.url === channelUrl && payload.tenant === tenant)
        )
      }
    })

    t.field('channelNewMessage', {
      type: 'Channel',
      args: { communityUrl: stringArg(), tenant: stringArg() },
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.subscribe('CHANNEL_NEW_MESSAGE'),
          filter((payload) => payload.channelNewMessage.channel.url === channelUrl && payload.tenant === tenant)
        )
      }
    })

    t.field('userWentOnline', {
      type: 'User',
      args: { tenant: stringArg() },
      nullable: true,
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.subscribe('USER_WENT_ONLINE'),
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
      nullable: true,
      subscribe: (_, { channelUrl, tenant }, context) => {
        return pipe(
          context.subscribe('USER_WENT_OFFLINE'),
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
      nullable: true,
      subscribe: ({ userTypingStatus }, { channelUrl, tenant, username }, context) => {
        return pipe(
          context.subscribe('USER_TYPING_STATUS'),
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
