import { queryField, stringArg, idArg } from 'nexus'
import { getUserId } from '../../utils';

export const files = queryField('files', {
  type: 'File',
  list: true,
  args: {
    after: idArg({ nullable: true }),
  },
  resolve: async (_, { after }, ctx) => {
    const userId = await getUserId(ctx)

    return ctx.prisma.file.findMany({
      after
    })
  },
})

export const userFiles = queryField('userFiles', {
  type: 'File',
  list: true,
  args: {
    after: idArg({ nullable: true }),
    userId: idArg(),
  },
  resolve: async (parent, {userId, after}, ctx) => {
    const requestUserId = await getUserId(ctx);

    const fileList = await ctx.prisma.file.findMany({
      where: {
        uploader: {
          id: userId,
        }
      },
        after
    });

    if( !fileList.length ) throw new Error("This user have no files")

    return fileList;
  },
})