import { mutationField, stringArg, booleanArg, nullable } from "nexus";
import { getUserId } from "../../utils";
import { Community } from '../index';

export const createCommunity = mutationField("createCommunity", {
  type: Community,
  args: {
    name: stringArg(),
    url: stringArg(),
    image: stringArg(),
    description: nullable(stringArg()),
    isPrivate: nullable(booleanArg())
  },
  resolve: (parent, { name, url, description, isPrivate, image }, Context) => {
    const userId = getUserId(Context);

    return Context.prisma.community.create({
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
  type: Community,
  args: { url: stringArg() },
  resolve: async (parent, { url }, Context) => {
    const userId = getUserId(Context);
    return Context.prisma.community.update({
      where: { url },
      data: { members: { connect: { id: userId } } }
    });
  }
});

export const unfollowCommunity = mutationField("unfollowCommunity", {
  type: Community,
  args: { url: stringArg() },
  resolve: async (parent, { url }, Context) => {
    const userId = getUserId(Context);
    return Context.prisma.community.update({
      where: { url },
      data: { members: { disconnect: { id: userId } } }
    });
  }
});
