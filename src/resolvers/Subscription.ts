import { subscriptionField, stringArg } from 'nexus'
import { filter, pipe } from 'graphql-yoga'
import ReactionSubscriptions from './Reaction/ReactionSubscriptions'
import { pubsub } from '../context'
export const newMessage = subscriptionField('newMessage', {
  type: 'Message',
  args: { channelUrl: stringArg(), tenant: stringArg() },
  // subscribe: (_, { channelUrl, tenant }, context) => {
  //   console.log(channelUrl, tenant, context, '===NEW_MESSAGE====')
  //   return pubsub.subscribe('NEW_MESSAGE')
  // },
  subscribe: (_, { channelUrl, tenant }, context) => {
    console.log(channelUrl, tenant, '===NEW_MESSAGE====')
    return pipe(
      pubsub.subscribe('NEW_MESSAGE'),
      filter((payload) => payload.message.channel.url === channelUrl)
    )
  },
  resolve: (payload) => {
    console.log(payload, '=== NEW_MESSAGEpayload====')
    return payload.message
  }
});

export const editMessage = subscriptionField('editMessage', {
  type: 'Message',
  args: { channelUrl: stringArg(), tenant: stringArg() },
  subscribe: (_, { channelUrl, tenant }, context) => {
    return pipe(
      pubsub.subscribe('EDITED_MESSAGE'),
      filter((payload) => payload.editMessage.channel.url === channelUrl)
    )
  },
  resolve: (payload) => payload
})

export const deleteMessage = subscriptionField('deleteMessage', {
  type: 'Message',
  args: { channelUrl: stringArg(), tenant: stringArg() },
  subscribe: (_, { channelUrl, tenant }, context) => {
    return pipe(
      context.pubsub.subscribe('DELETED_MESSAGE'),
      filter((payload) => payload.deleteMessage.channel.url === channelUrl)
    )
  },
  resolve: (payload) => payload
})

export const newNotification = subscriptionField('newNotification', {
  type: 'Notification',
  args: { receiverId: stringArg(), tenant: stringArg() },
  subscribe: (_, { channelUrl, tenant }, context) => {
    return pipe(
      context.pubsub.subscribe('NEW_NOTIFICATION'),
      filter((payload) => payload.newNotification.channel.url === channelUrl)
    )
  },
  resolve: (payload) => payload
})

export const channelNewMessage = subscriptionField('channelNewMessage', {
  type: 'Channel',
  args: { communityUrl: stringArg(), tenant: stringArg() },
  subscribe: (_, { channelUrl, tenant }, context) => {
    console.log(channelUrl, tenant, '===channelNewMessage====')
    return pipe(
      context.pubsub.subscribe('CHANNEL_NEW_MESSAGE'),
      filter((payload) => payload.channelNewMessage.channel.url === channelUrl)
    )
  },
  resolve: (payload) => payload
})


export const userWentOnline = subscriptionField('userWentOnline', {
  type: 'User',
  args: { tenant: stringArg() },
  subscribe: (_, { channelUrl, tenant }, context) => {
    return pipe(
      context.pubsub.subscribe('USER_WENT_ONLINE'),
      filter((payload) => payload.tenant === tenant)
    )
  },
  resolve: (payload) => {
    return payload.user
  }
})


export const userWentOffline = subscriptionField('userWentOffline', {
  type: 'User',
  args: { tenant: stringArg() },
  subscribe: (_, { channelUrl, tenant }, context) => {
    return pipe(
      context.pubsub.subscribe('USER_WENT_OFFLINE'),
      filter((payload) => payload.tenant === tenant)
    )
  },
  resolve: (payload) => {
    return payload.user
  }
})


export const userTypingStatus = subscriptionField('userTypingStatus', {
  type: 'TypingStatus',
  args: {
    channelUrl: stringArg(),
    tenant: stringArg(),
    username: stringArg()
  },

  subscribe: ({ userTypingStatus }, { channelUrl, tenant, username }, context) => {
    return pipe(
      context.pubsub.subscribe('USER_TYPING_STATUS'),
      filter(
        (payload) =>
          channelUrl === userTypingStatus.channelUrl &&
          userTypingStatus.tenant === tenant &&
          userTypingStatus.username !== username
      )
    )
  },
  resolve: (payload) => payload
})

    // ReactionSubscriptions(t)
//   }
// })
