import { queryField, list, idArg, nullable } from 'nexus'
import { getUserId } from '../../utils';

export const files = queryField('files', {
  type: list('File'),
  
  args: {
    after: nullable(idArg()),
  },
  resolve: async (_, { after }, Context) => {
    const userId = await getUserId(Context)

    return Context.prisma.file.findMany({
      take: +after!
    })
  },
})

export const userFiles = queryField('userFiles', {
  type: list('File'),
  
  args: {
    after: nullable(idArg()),
    userId: idArg(),
  },
  resolve: async (parent, {userId, after}, Context) => {
    const requestUserId = await getUserId(Context);

    const fileList = await Context.prisma.file.findMany({
      where: {
        uploader: {
          id: userId!,
        }
      },
      take: +after!
    });

    if( !fileList.length ) throw new Error("This user have no files")

    return fileList;
  },
})