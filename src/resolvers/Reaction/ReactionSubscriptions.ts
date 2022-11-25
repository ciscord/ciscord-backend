import { withFilter } from "graphql-yoga";
import { stringArg } from "nexus";

const ReactionSubscriptions = (t: any) => {
  t.field("newReaction", {
    type: "Reaction",
    args: { channelUrl: stringArg(), tenant: stringArg() },
    nullable: true,
    subscribe: withFilter(
      (parent, { channelUrl, tenant }, ctx) =>
        ctx.pubsub.asyncIterator("NEW_REACTION"),
      (payload, { channelUrl, tenant }) =>
        payload.newReaction.message.channel.url === channelUrl && payload.tenant === tenant
    )
  });

  t.field("updatedReaction", {
    type: "Reaction",
    args: { channelUrl: stringArg(), tenant: stringArg() },
    nullable: true,
    subscribe: withFilter(
      (parent, { channelUrl, tenant }, ctx) =>
        ctx.pubsub.asyncIterator("UPDATE_REACTION"),
      (payload, { channelUrl, tenant }) =>
        payload.updatedReaction.message.channel.url === channelUrl && payload.tenant === tenant
    )
  });

  t.field("removedReaction", {
    type: "Reaction",
    args: { channelUrl: stringArg(), tenant: stringArg() },
    nullable: true,
    subscribe: withFilter(
      (parent, { channelUrl, tenant }, ctx) =>
        ctx.pubsub.asyncIterator("REMOVE_REACTION"),
      (payload, { channelUrl, tenant }) =>
        payload.removedReaction.message.channel.url === channelUrl && payload.tenant === tenant
    )
  });
};

export default ReactionSubscriptions;
