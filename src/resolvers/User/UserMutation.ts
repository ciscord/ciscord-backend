import { mutationField, stringArg } from 'nexus'
import { sign } from 'jsonwebtoken'
import { compare, hash } from 'bcryptjs'
import { getTenant, getUserId } from '../../utils'
import { channel } from '../Channel/ChannelQuery'
import { disconnect } from 'cluster'

export const login = mutationField('login', {
  type: 'AuthPayload',
  args: {
    email: stringArg({ nullable: false }),
    password: stringArg({ nullable: false }),
    social: stringArg({ nullable: false })
  },
  resolve: async (_parent, { email, password, social }, context) => {
    try {
      let user = await context.prisma.user.findOne({
        where: { email }
      })
      if (!user) {
        throw new Error(`No user found for email: ${email}`)
      }

      if (social === '') {
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
      }

      const twitterProfile = JSON.parse(social)
      user = await context.prisma.user.update({
        where: { email },
        data: {
          image: twitterProfile.photos[0].value,
        }
      })
      
      const data = {
        token: sign(
          { userId: user.id, tenant: getTenant(context) },
          process.env['APP_SECRET']
        ),
        user
      }
      console.log(data, 'user')
      return data;
    } catch (error) {
      if (social !== '') {
        const twitterProfile = JSON.parse(social)
        const user = await context.prisma.user.create({
          data: {
            username: twitterProfile.username,
            fullname: twitterProfile.displayName,
            image: twitterProfile.photos[0].value,
            email,
            social: 'twitter',
            password: '',
            communitiesFollowed: { connect: { url: 'general' } }
          }
        })

        await context.prisma.community.update({
          where: { url: 'general' },
          data: { members: { connect: { email } } }
        })

        await context.prisma.role.update({
          where: { title: 'Member' },
          data: { users: { connect: { id: user.id } } }
        })

        return {
          token: sign({ userId: user.id }, process.env['APP_SECRET']),
          user
        }
      } else {
        throw new Error(`No user found for email: ${email}`)
      }
    }
  }
})

export const signup = mutationField('signup', {
  type: 'AuthPayload',
  args: {
    fullname: stringArg({ nullable: false }),
    username: stringArg({ nullable: false }),
    bio: stringArg(),
    email: stringArg({ nullable: false }),
    password: stringArg({ nullable: false })
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
        process.env['APP_SECRET']
      ),
      user
    }
  }
})

export const updateUser = mutationField('updateUser', {
  type: 'User',
  args: {
    email: stringArg({ nullable: false }),
    fullname: stringArg({ nullable: false }),
    username: stringArg({ nullable: false }),
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
  list: true,
  args: { searchString: stringArg({ nullable: true }) },
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
    channelUrl: stringArg({ nullable: true })
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
