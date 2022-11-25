import { mutationField, stringArg, nonNull } from 'nexus'
import { getUserId } from '../../utils'
import { User } from '../index';

export const updateChannelInfo = mutationField("updateChannelInfo", {
  type: 'User',
  args: {
    channelUrl: nonNull(stringArg()),
    date: nonNull(stringArg()),
  },
  resolve: async (_parent, { channelUrl, date }, Context) => {
    const userId = await getUserId(Context);

    const user = await Context.prisma.user.findOne({
      where: { id: userId },
      include: { channelsInfo: { include: { channel: true } } }
    });

    const channel = await Context.prisma.channel.findOne({
      where: {
        url: channelUrl
      }
    });

    if (!channel) throw new Error("nonexistent channel ");

    const channelsInfo = await Context.prisma.channelInfo.findMany({
      where: {
        channel: { url: channelUrl },
        user: { id: userId }
      },
      include: {
        channel: true,
        user: true
      }
    });

    if (channelsInfo.length > 0) {
      const channelInfo = channelsInfo[0];

      if (
        channelInfo &&
        new Date(channelInfo.lastUpdateAt).getTime() > new Date(date).getTime()
      ) {
        return user;
      }
    }
    
    const res = await Context.prisma.channelInfo.upsert({
      where: {
        uniqueUserChannelPair: `${user.username}:${channel.url}`
      },
      create: {
        channel: { connect: { id: channel.id } },
        user: { connect: { id: userId } },
        uniqueUserChannelPair: `${user.username}:${channel.url}`,
      },
      update: {
        lastUpdateAt: new Date(date)
      },
      include: {
        user: true,
        channel: true
      }
    });

    const index = user.channelsInfo.findIndex(({id}) => id === res.id);
    const newInfos = user.channelsInfo;
    newInfos[index] = res;

    return { ...user, channelsInfo: [...newInfos] };
  }
});
