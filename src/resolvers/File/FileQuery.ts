import { queryField, list, idArg, nullable } from 'nexus'
import { getUserId } from '../../utils'

export const files = queryField('files', {
  type: list('UFile'),
  args: {
    after: nullable(idArg())
  },
  resolve: async (_, { after }, ctx) => {
    const userId = await getUserId(ctx)

    if (!userId) {
      throw new Error('nonexistent user')
    }
    return ctx.prisma.file.findMany({
      take: +after!
    })
  }
})

export const userFiles = queryField('userFiles', {
  type: list('UFile'),
  args: {
    after: nullable(idArg()),
    userId: idArg()
  },
  resolve: async (parent, { userId, after }, ctx) => {
    const requestUserId = await getUserId(ctx)

    const fileList = await ctx.prisma.file.findMany({
      where: {
        uploader: {
          id: userId!
        }
      },
      take: +after!
    })

    if (!fileList.length) throw new Error('This user have no files')

    return fileList
  }
})
