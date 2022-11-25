import { queryField, stringArg, nonNull, nullable, list } from 'nexus'
import { getUserId, isEmpty } from '../../utils'
import Twitter from 'twitter'

const client = new Twitter({
  consumer_key: process.env['TWITTER_CONSUMER_KEY'] || '',
  consumer_secret: process.env['TWITTER_CONSUMER_SECRET'] || '',
  access_token_key: process.env['TWITTER_TOKEN'] || '',
  access_token_secret: process.env['TWITTER_TOKEN_SECRET'] || ''
})

export const me = queryField('me', {
  type: 'User',
  resolve: (_, args, ctx) => {
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
  type: 'TwitterPayload',
  args: { username: nonNull(stringArg()) },
  resolve: async (_parent, { username }, ctx): Promise<any> => {
    if (!username) throw 'username is required'

    const user = await ctx.prisma.user.findFirst({
      where: {
        username
      }
    })

    const params = { screen_name: username }

    const userObject = await client.get('users/show', params)

    return {
      bio: userObject ? userObject.description : '',
      followers: userObject ? userObject.followers_count : 0,
      followings: userObject ? userObject.friends_count : 0,
      user
    }
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
