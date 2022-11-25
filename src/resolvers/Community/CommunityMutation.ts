import { mutationField, stringArg, booleanArg } from "nexus";
import { getUserId } from "../../utils";

export const createCommunity = mutationField("createCommunity", {
  type: "Community",
  args: {
    name: stringArg(),
    url: stringArg(),
    image: stringArg(),
    description: stringArg({ nullable: true }),
    isPrivate: booleanArg({ nullable: true })
  },
  resolve: (parent, { name, url, description, isPrivate, image }, ctx) => {
    const userId = getUserId(ctx);

    return ctx.prisma.community.create({
      data: {
        name,
        url,
        image,
        description,
        isPrivate,
        author: { connect: { id: userId } },
        members: { connect: { id: userId } },
        channels: {
          create: {
            name: "general",
            description: "Talk on a general topic",
            url: `${url}/general`,
            author: { connect: { id: userId } }
          }
        }
      }
    });
  }
});

export const followCommunity = mutationField("followCommunity", {
  type: "Community",
  args: { url: stringArg() },
  resolve: async (parent, { url }, ctx) => {
    const userId = getUserId(ctx);
    return ctx.prisma.community.update({
      where: { url },
      data: { members: { connect: { id: userId } } }
    });
  }
});

export const unfollowCommunity = mutationField("unfollowCommunity", {
  type: "Community",
  args: { url: stringArg() },
  resolve: async (parent, { url }, ctx) => {
    const userId = getUserId(ctx);
    return ctx.prisma.community.update({
      where: { url },
      data: { members: { disconnect: { id: userId } } }
    });
  }
});
