import { mutationField, stringArg, booleanArg } from "nexus";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { getTenant, getUserId } from "../../utils";

export const setUserTypingStatus = mutationField("setUserTypingStatus", {
  type: "TypingStatus",
  args: { channelUrl: stringArg(), isTyping: booleanArg() },
  resolve: async (parent, { channelUrl, isTyping }, Context) => {
    const userId = await getUserId(Context);

    const user = await Context.prisma.user.findOne({
      where: {
        id: userId
      }
    });

    Context.pubsub.publish("USER_TYPING_STATUS", {
      userTypingStatus: {
        username: user.username,
        tenant: await getTenant(Context),
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
