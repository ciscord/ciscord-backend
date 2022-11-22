import { queryField, stringArg, idArg, nullable } from 'nexus'
import { getUserId } from '../../utils';

export const files = queryField('files', {
  type: 'File',
  
  args: {
    after: nullable(idArg()),
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
  
  args: {
    after: nullable(idArg()),
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