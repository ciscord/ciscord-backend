import { mutationField, stringArg, nonNull, nullable } from 'nexus'
import { sign } from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'
import { getTenant, getUserId } from '../../utils'
import { AuthPayload, User } from '../index';

export const login = mutationField('login', {
  type: 'AuthPayload',
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_parent, { email, password }, context) => {
    try {
      let user = await context.prisma.user.findUnique({
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
        token: sign(
          { userId: user.id },
          process.env['APP_SECRET'] || ''
        ),
        user
      }
      console.log(data, 'user')
      return data;
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
  resolve: async (
    _parent,
    { fullname, username, bio, email, password },
    context
  ) => {
    const hashedPassword = await hash(password, 10)
    const user = await context.prisma.user.create({
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

    await context.prisma.community.update({
      where: { url: 'general' },
      data: { members: { connect: { username } } }
    })

    await context.prisma.role.update({
      where: { title: 'Member' },
      data: { users: { connect: { id: user.id } } }
    })

    return {
      token: sign(
        { userId: user.id, tenant: getTenant(context) },
        process.env['APP_SECRET'] || ''
      ),
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
  resolve: (_parent, { email, fullname, username, image }, context) => {
    return context.prisma.user.update({
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
  resolve: (parent, { searchString }, context) => {
    return context.prisma.user.findMany({
      where: {
        username: {
          contains: searchString
        }
      }
    })
  }
})

export const logout = mutationField('logout', {
  type: 'User',
  resolve: async (parent, args, context) => {
    try {
      const userId = await getUserId(context)
      const user = await context.prisma.user.update({
        where: { id: userId },
        data: { isOnline: false }
      })
      context.pubsub.publish('USER_WENT_OFFLINE', {
        user,
        tenant: await getTenant(context)
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
  resolve: async (_parent, { channelUrl }, context) => {
    try {
      const userId = await getUserId(context)
      const user = await context.prisma.user.update({
        where: { id: userId },
        data: { currentChannel: { connect: { url: channelUrl } } }
      })
      return user
    } catch (error) {}
  }
})
