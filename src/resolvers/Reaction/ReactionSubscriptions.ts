import { filter, pipe } from 'graphql-yoga'
import { stringArg } from "nexus";

const ReactionSubscriptions = (t: any) => {
  t.field("newReaction", {
    type: "Reaction",
    args: { channelUrl: stringArg(), tenant: stringArg() },
    
    subscribe: (_, { channelUrl, tenant }, context) => {
      return pipe(
        context.subscribe('NEW_REACTION'),
        filter((payload) => payload.newReaction.message.channel.url === channelUrl && payload.tenant === tenant)
      )
    },
  });

  t.field("updatedReaction", {
    type: "Reaction",
    args: { channelUrl: stringArg(), tenant: stringArg() },
    
    subscribe: (_, { channelUrl, tenant }, context) => {
      return pipe(
        context.subscribe('UPDATE_REACTION'),
        filter((payload) => payload.updatedReaction.message.channel.url === channelUrl && payload.tenant === tenant)
      )
    },
  });

  t.field("removedReaction", {
    type: "Reaction",
    args: { channelUrl: stringArg(), tenant: stringArg() },
    
    subscribe: (_, { channelUrl, tenant }, context) => {
      return pipe(
        context.subscribe('REMOVE_REACTION'),
        filter((payload) => payload.removedReaction.message.channel.url === channelUrl && payload.tenant === tenant)
      )
    },
  });
};

export default ReactionSubscriptions;
