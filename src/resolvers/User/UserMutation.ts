import { mutationField, stringArg, nonNull, nullable } from 'nexus'
import { sign } from 'jsonwebtoken'
import { isEmpty } from '../../utils'
import { compare, hash } from 'bcryptjs'
import { getTenant, getUserId } from '../../utils'

export const login = mutationField('login', {
  type: 'AuthPayload',
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg())
  },
  resolve: async (_parent, { email, password }, ctx): Promise<any> => {
    try {
      let user = await ctx.prisma.user.findUnique({
        where: { email }
      })
      if (!user) {
        throw new Error(`No user found for email: ${email}`)
      }

      const passwordValid = await compare(password, user.password!)
      if (!passwordValid) {
        throw new Error('Invalid password')
      }

      const data = {
        token: sign({ userId: user.id }, process.env['APP_SECRET'] || ''),
        user
      }
      console.log(data, 'user')
      return data
    } catch (error) {
      throw error
    }
  }
})

export const signup = mutationField('signup', {
  type: 'AuthPayload',
  args: {
    fullname: nonNull(stringArg()),
    username: nonNull(stringArg()),
    bio: stringArg(),
    email: nonNull(stringArg()),
    password: nonNull(stringArg())
  },
  resolve: async (_parent, { fullname, username, bio, email, password }, ctx): Promise<any> => {
    const hashedPassword = await hash(password, 10)
    const user = await ctx.prisma.user.create({
      data: {
        username,
        fullname,
        bio,
        email,
        social: '',
        password: hashedPassword,
        communitiesFollowed: { connect: { url: 'general' } }
      }
    })

    await ctx.prisma.community.update({
      where: { url: 'general' },
      data: { members: { connect: { username } } }
    })

    await ctx.prisma.role.update({
      where: { title: 'Member' },
      data: { users: { connect: { id: user.id } } }
    })

    return {
      token: sign({ userId: user.id, tenant: getTenant(ctx) }, process.env['APP_SECRET'] || ''),
      user
    }
  }
})

export const updateUser = mutationField('updateUser', {
  type: 'User',
  args: {
    email: nonNull(stringArg()),
    fullname: nonNull(stringArg()),
    username: nonNull(stringArg()),
    image: stringArg()
  },
  resolve: (_parent, { email, fullname, username, image }, ctx): Promise<any> => {
    return ctx.prisma.user.update({
      where: { email },
      data: {
        username,
        fullname,
        image
      }
    })
  }
})

export const users = mutationField('users', {
  type: 'User',
  args: { searchString: nullable(stringArg()) },
  resolve: (parent, { searchString }, ctx): Promise<any> => {
    if (isEmpty(searchString)) {
      throw new Error(`no searchString`)
    }

    return ctx.prisma.user.findMany({
      where: {
        username: {
          contains: searchString!
        }
      }
    })
  }
})

export const logout = mutationField('logout', {
  type: 'User',
  resolve: async (parent, args, ctx): Promise<any> => {
    try {
      const userId = await getUserId(ctx)
      if (!userId) {
        throw new Error('nonexistent user')
      }
      const user = await ctx.prisma.user.update({
        where: { id: userId },
        data: { isOnline: false }
      })
      ctx.pubsub.publish('USER_WENT_OFFLINE', {
        user,
        tenant: await getTenant(ctx)
      })
      return user
    } catch (error) {}
  }
})

export const setCurrentChannel = mutationField('setCurrentChannel', {
  type: 'User',
  args: {
    channelUrl: nullable(stringArg())
  },
  resolve: async (_parent, { channelUrl }, ctx): Promise<any> => {
    try {
      const userId = await getUserId(ctx)
      if (!userId) {
        throw new Error('nonexistent user')
      }
      const user = await ctx.prisma.user.update({
        where: { id: userId },
        data: { currentChannel: { connect: { url: channelUrl! } } }
      })
      return user
    } catch (error) {}
  }
})
