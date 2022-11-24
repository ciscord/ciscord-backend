import { mutationField, stringArg } from "nexus";
import { getUserId, getTenant } from "../../utils";
import { Reaction } from '../index';

type reactionPayload = {
  messageId?: string;
  name?: string;
  Context: any;
  userId?: string;
  reactionId?: string;
}

const addNewReaction = async ({messageId, name, Context, userId}: reactionPayload) => {
  const reaction = await Context.prisma.reaction.create({
    data: {
      name: name,
      users: { connect: { id: userId } },
      message: { connect: { id: messageId } }
    },
    include: { message: { include: {channel: true}, }, }
  });

  Context.pubsub.publish('NEW_REACTION', {
    newReaction: reaction,
    tenant: getTenant(Context),
  })

  return reaction;
}

const addReactedUser = async ({reactionId, Context, userId}: reactionPayload) => {
  const reaction = await Context.prisma.reaction.update({
    where: {id: reactionId},
    data: {
      users: {connect: {id: userId}}
    },
    include: {
      message: { include: {channel: true}, },
      users: true,
    }
  });

  Context.pubsub.publish('UPDATE_REACTION', {
    updatedReaction: reaction,
    tenant: getTenant(Context),
  })

  return reaction;
}

const removeReactedUser = async ({reactionId, Context, userId}: reactionPayload) => {
  const reaction = await Context.prisma.reaction.update({
    where: {id: reactionId},
    data: {
      users: {disconnect: {id: userId}}
    },
    include: {
      message: { include: {channel: true}, },
      users: true,
    }
  });

  Context.pubsub.publish('UPDATE_REACTION', {
    updatedReaction: reaction,
    tenant: getTenant(Context),
  })

  return reaction;
}

const removeReaction = async ({reactionId, Context}: reactionPayload) => {
 const result = await Context.prisma.reaction.delete({
    where: { id: reactionId },
    include: {
      message: { include: {channel: true}, },
      users: true,
    }
  });

  Context.pubsub.publish('REMOVE_REACTION', {
    removedReaction: result,
    tenant: getTenant(Context),
  })

  return result;
}

export const toggleReaction = mutationField("toggleReaction", {
  type: Reaction,
  args: {
    messageId: stringArg(),
    name: stringArg()
  },
  resolve: async (parent, { messageId, name }, Context) => {
    const userId = await getUserId(Context) || "ck3fot8rr0000qmkp16jlc1mq"; // TODO: REMOVE TEST ID

    const existingReaction = (
      await Context.prisma.reaction.findMany({
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
      const reaction = await addNewReaction({ userId, name, messageId, Context });

      return reaction;
    }

    if (existingReaction.users.findIndex(({id})=> id === userId) === -1) {
      const reaction = await addReactedUser({ userId, reactionId: existingReaction.id , Context });

      return reaction;
    }

    if (existingReaction.users.length > 1) {
      const reaction = await removeReactedUser({ userId, reactionId: existingReaction.id, Context });

      return reaction;
    } else {
      const reaction = await removeReaction({ reactionId: existingReaction.id, Context });

      return reaction;
    }
  }
});
