import { objectType } from 'nexus'
import { withFilter } from 'graphql-yoga'
import { stringArg } from 'nexus'
import ReactionSubscriptions from './Reaction/ReactionSubscriptions'

export const Subscription = objectType({
  name: 'Subscription',
  definition(t) {
    t.field('newMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      subscribe: withFilter(
        (_parent, { channelUrl, tenant }, ctx) => ctx.pubsub.asyncIterator('NEW_MESSAGE'),
        (payload, { channelUrl, tenant }) => {
          return payload.newMessage.channel.url === channelUrl && payload.tenant === tenant
        }
      ),
      resolve: payload => {
        return payload.newMessage
      }
    })

    t.field('editMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      nullable: true,
      subscribe: withFilter(
        (_parrent, { channelUrl, tenant }, ctx) => {
          return ctx.pubsub.asyncIterator('EDITED_MESSAGE')
        },
        (payload, { channelUrl, tenant }) => {
          return payload.editMessage.channel.url === channelUrl && payload.tenant === tenant
        }
      )
    })

    t.field('deleteMessage', {
      type: 'Message',
      args: { channelUrl: stringArg(), tenant: stringArg() },
      nullable: true,
      subscribe: withFilter(
        (_parrent, { channelUrl, tenant }, ctx) => {
          return ctx.pubsub.asyncIterator('DELETED_MESSAGE')
        },
        (payload, { channelUrl, tenant }) => {
          return payload.deleteMessage.channel.url === channelUrl && payload.tenant === tenant
        }
      )
    })

    t.field('newNotification', {
      type: 'Notification',
      args: { receiverId: stringArg(), tenant: stringArg() },
      subscribe: withFilter(
        (_parent, { receiverId, tenant }, ctx) => ctx.pubsub.asyncIterator('NEW_NOTIFICATION'),
        (payload, { receiverId, tenant }) => {
          return payload.newNotification.receiver.id === receiverId && payload.tenant === tenant
        }
      )
    })

    t.field('channelNewMessage', {
      type: 'Channel',
      args: { communityUrl: stringArg(), tenant: stringArg() },
      subscribe: withFilter(
        (_parent, { communityUrl, tenant }, ctx) => ctx.pubsub.asyncIterator('CHANNEL_NEW_MESSAGE'),
        (payload, { communityUrl, tenant }) => {
          return payload.channelNewMessage.community.url === communityUrl && payload.tenant === tenant
        }
      )
    })

    t.field('userWentOnline', {
      type: 'User',
      args: { tenant: stringArg() },
      nullable: true,
      subscribe: withFilter(
        (_parent, { tenant }, ctx) => ctx.pubsub.asyncIterator('USER_WENT_ONLINE'),
        (payload, { tenant }) => {
          return payload.tenant === tenant
        }
      ),
      resolve: payload => {
        return payload.user
      }
    })

    t.field('userWentOffline', {
      type: 'User',
      args: { tenant: stringArg() },
      nullable: true,
      subscribe: withFilter(
        (_parent, { tenant }, ctx) => ctx.pubsub.asyncIterator('USER_WENT_OFFLINE'),
        (payload, { tenant }) => {
          return payload.tenant === tenant
        }
      ),
      resolve: payload => {
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
      subscribe: withFilter(
        (_parent, { channelUrl, tenant, username }, ctx) => ctx.pubsub.asyncIterator('USER_TYPING_STATUS'),
        ({ userTypingStatus }, { channelUrl, tenant, username }) =>
          channelUrl === userTypingStatus.channelUrl &&
          userTypingStatus.tenant === tenant &&
          userTypingStatus.username !== username
      )
    })

    ReactionSubscriptions(t)
  }
})
