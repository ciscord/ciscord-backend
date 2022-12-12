import { queryField, stringArg, nonNull, nullable, list } from 'nexus'
import { getUserId, isEmpty } from '../../utils'
import { User } from '../';

export const me = queryField('me', {
  type: 'User',
  resolve: (_, args, ctx): Promise<any> => {
    const userId = getUserId(ctx)
    if (!isEmpty(userId)) {
      return ctx.prisma.user.findFirst({
        where: {
          id: userId
        }
      })
    }
    throw new Error(`Invalid Token`)
  }
})

export const getUser = queryField('getUser', {
  type: 'User',
  args: { username: nonNull(stringArg()) },
  resolve: async (_parent, { username }, ctx): Promise<any> => {
    if (!username) throw 'username is required'

    return ctx.prisma.user.findFirst({
      where: {
        username
      }
    })
  }
})

export const users = queryField('users', {
  type: list('User'),
  args: { searchString: nullable(stringArg()) },
  resolve: (parent, { searchString }: any, ctx): Promise<any> => {
    return ctx.prisma.user.findMany({
      where: {
        username: {
          contains: searchString
        }
      },
      orderBy: { username: 'asc' }
    })
  }
})
