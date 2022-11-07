import { queryField, stringArg } from 'nexus'
import { getUserId, isEmpty } from '../../utils'
import * as Twitter from 'twitter'

const client = new Twitter({
  consumer_key: process.env['TWITTER_CONSUMER_KEY'],
  consumer_secret: process.env['TWITTER_CONSUMER_SECRET'],
  access_token_key: process.env['TWITTER_TOKEN'],
  access_token_secret: process.env['TWITTER_TOKEN_SECRET']
})

export const me = queryField('me', {
  type: 'User',
  resolve: (parent, args, ctx) => {
    const userId: string = getUserId(ctx);
    if (!isEmpty(userId)) {
      return ctx.prisma.user.findOne({
        where: {
          id: userId,
        },
      })
    }
    throw new Error(`Invalid Token`)

  },
})

export const getUser = queryField('getUser', {
  type: 'TwitterPayload',
  args: { username: stringArg({ nullable: false }) },
  resolve: async (_parent, { username }, context) => {
    if(!username) throw "username is required";

    const user = await context.prisma.user.findOne({
      where: {
        username,
      },
    });

    const params = { screen_name: username }

    const userObject = await client.get('users/show', params)

    return {
      bio: userObject ? userObject.description : '',
      followers: userObject ? userObject.followers_count : 0,
      followings: userObject ? userObject.friends_count : 0,
      user
    };
  },
})

export const users = queryField('users', {
  type: 'User',
  list: true,
  args: { searchString: stringArg({ nullable: true }) },
  resolve: (parent, { searchString } : any, ctx) => {
    return ctx.prisma.user.findMany({
      where: {
        username: {
          contains: searchString,
        },
      },
      orderBy: { username: 'asc' }
    })
  },
})
