import { mutationField, stringArg } from "nexus";
import { getUserId, getTenant } from "../../utils";

type reactionPayload = {
  messageId?: string;
  name?: string;
  ctx: any;
  userId?: string;
  reactionId?: string;
}

const addNewReaction = async ({messageId, name, ctx, userId}: reactionPayload) => {
  const reaction = await ctx.prisma.reaction.create({
    data: {
      name: name,
      users: { connect: { id: userId } },
      message: { connect: { id: messageId } }
    },
    include: { message: { include: {channel: true}, }, }
  });

  ctx.pubsub.publish('NEW_REACTION', {
    newReaction: reaction,
    tenant: getTenant(ctx),
  })

  return reaction;
}

const addReactedUser = async ({reactionId, ctx, userId}: reactionPayload) => {
  const reaction = await ctx.prisma.reaction.update({
    where: {id: reactionId},
    data: {
      users: {connect: {id: userId}}
    },
    include: {
      message: { include: {channel: true}, },
      users: true,
    }
  });

  ctx.pubsub.publish('UPDATE_REACTION', {
    updatedReaction: reaction,
    tenant: getTenant(ctx),
  })

  return reaction;
}

const removeReactedUser = async ({reactionId, ctx, userId}: reactionPayload) => {
  const reaction = await ctx.prisma.reaction.update({
    where: {id: reactionId},
    data: {
      users: {disconnect: {id: userId}}
    },
    include: {
      message: { include: {channel: true}, },
      users: true,
    }
  });

  ctx.pubsub.publish('UPDATE_REACTION', {
    updatedReaction: reaction,
    tenant: getTenant(ctx),
  })

  return reaction;
}

const removeReaction = async ({reactionId, ctx}: reactionPayload) => {
 const result = await ctx.prisma.reaction.delete({
    where: { id: reactionId },
    include: {
      message: { include: {channel: true}, },
      users: true,
    }
  });

  ctx.pubsub.publish('REMOVE_REACTION', {
    removedReaction: result,
    tenant: getTenant(ctx),
  })

  return result;
}

export const toggleReaction = mutationField("toggleReaction", {
  type: "Reaction",
  args: {
    messageId: stringArg(),
    name: stringArg()
  },
  resolve: async (parent, { messageId, name }, ctx) => {
    const userId = await getUserId(ctx) || "ck3fot8rr0000qmkp16jlc1mq"; // TODO: REMOVE TEST ID

    const existingReaction = (
      await ctx.prisma.reaction.findMany({
        where: {
          name,
          message: {
            id: messageId
          }
        },
        include: {
          users: true,
          message: {
            include: {
              channel: true,
            }
          }
        }
      })
    )[0];

    if (!existingReaction) {
      const reaction = await addNewReaction({ userId, name, messageId, ctx });

      return reaction;
    }

    if (existingReaction.users.findIndex(({id})=> id === userId) === -1) {
      const reaction = await addReactedUser({ userId, reactionId: existingReaction.id , ctx });

      return reaction;
    }

    if (existingReaction.users.length > 1) {
      const reaction = await removeReactedUser({ userId, reactionId: existingReaction.id, ctx });

      return reaction;
    } else {
      const reaction = await removeReaction({ reactionId: existingReaction.id, ctx });

      return reaction;
    }
  }
});
