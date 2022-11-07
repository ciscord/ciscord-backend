import { mutationField, stringArg, arg } from "nexus";
import { getUserId, getTenant } from "../../utils";
import { processUpload, deleteFromAws } from "../../utils/fileApi";
import { removeFile,getOpenGraphData, createRemoteAttachments } from "../../utils/helpers";

export const replyMessage = mutationField("replyMessage", {
  type: "ReplyMessage",
  args: {
    body: stringArg(),
    parentId: stringArg(),
    attachments: stringArg({ list: true, nullable: true }),
    urlList: stringArg({ list: true, nullable: true })
  },
  resolve: async (parent, { body, parentId, attachments, urlList }, ctx) => {
    const userId = (await getUserId(ctx)) || "ck3fot8rr0000qmkp16jlc1mq";

    const data = {
      body,
      author: { connect: { id: userId } },
      parent: { connect: { id: parentId } },
      attachments: {},
      remoteAttachments: await createRemoteAttachments(urlList),
    };

    if (attachments) {
      data.attachments = {
        connect: attachments.map((Key: string ) => ({
          Key
        }))
      };
    }

    const replyMessage = await ctx.prisma.replyMessage.create({
      data,
      include: {
        parent: { include: { channel: true, children: true, reactions: true } },
        author: true
      }
    });

    ctx.pubsub.publish("EDITED_MESSAGE", {
      editMessage: replyMessage.parent,
      tenant: getTenant(ctx),
    });

    return replyMessage;
  }
});

export const editReplyMessage = mutationField("editReplyMessage", {
  type: "ReplyMessage",
  args: {
    body: stringArg(),
    messageId: stringArg()
  },
  resolve: async (parent, { body, messageId }, ctx) => {
    const userId = getUserId(ctx) || "ck3fot8rr0000qmkp16jlc1mq";

    if (!userId) {
      throw new Error("nonexistent user");
    }

    const requestingUserIsAuthor = await ctx.prisma.replyMessage.findMany({
      where: {
        id: messageId,
        author: { id: userId }
      }
    });

    if (!requestingUserIsAuthor[0]) {
      throw new Error(
        "Invalid permissions, you must be an author of this post to edit it."
      );
    }

    const message = await ctx.prisma.replyMessage.update({
      where: {
        id: messageId
      },
      data: {
        body
      },
      include: {
        parent: { include: { channel: true, children: true, reactions: true } },
        author: true
      }
    });

    ctx.pubsub.publish("EDITED_MESSAGE", {
      editMessage: message.parent,
      tenant: getTenant(ctx),
    });

    return message;
  }
});

export const deleteReplyMessage = mutationField("deleteReplyMessage", {
  type: "ReplyMessage",
  args: {
    messageId: stringArg()
  },
  resolve: async (parent, { messageId }, ctx) => {
    const userId = getUserId(ctx) || "ck3fot8rr0000qmkp16jlc1mq";

    if (!userId) {
      throw new Error("nonexistent user");
    }

    const requestingUserIsAuthor = await ctx.prisma.replyMessage.findMany({
      where: {
        id: messageId,
        author: { id: userId }
      },
      include: { attachments: true }
    });

    if (!requestingUserIsAuthor[0]) {
      throw new Error(
        "Invalid permissions, you must be an author of this post to delete it."
      );
    }

    const filesList = requestingUserIsAuthor[0].attachments.map(({ Key }) => Key);

    await removeFile({filesList, ctx, messageId});

    const message = await ctx.prisma.replyMessage.delete({
      where: {
        id: messageId
      },
      include: {
        parent: { include: { channel: true, children: true, reactions: true } },
        author: true
      }
    });

    ctx.pubsub.publish("EDITED_MESSAGE", {
      editMessage: message.parent,
      tenant: getTenant(ctx),
    });

    return message;
  }
});