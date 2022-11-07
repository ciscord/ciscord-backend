import { mutationField, stringArg, booleanArg } from "nexus";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { APP_SECRET, getTenant, getUserId } from "../../utils";

export const setUserTypingStatus = mutationField("setUserTypingStatus", {
  type: "TypingStatus",
  args: { channelUrl: stringArg(), isTyping: booleanArg() },
  resolve: async (parent, { channelUrl, isTyping }, ctx) => {
    const userId = await getUserId(ctx);

    const user = await ctx.prisma.user.findOne({
      where: {
        id: userId
      }
    });

    ctx.pubsub.publish("USER_TYPING_STATUS", {
      userTypingStatus: {
        username: user.username,
        tenant: await getTenant(ctx),
        isTyping,
        channelUrl
      }
    });

    return {
      username: user.username,
      isTyping
    };
  }
});
