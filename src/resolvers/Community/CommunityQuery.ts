import { queryField, stringArg, idArg } from 'nexus'
import { getUserId } from '../../utils'

export const community = queryField('community', {
  type: 'Community',
  nullable: true,
  args: {
    id: idArg({ nullable: true }),
    url: stringArg({ nullable: true })
  },
  resolve: (parent, { id, url }, ctx) => {
    if (id) {
      return ctx.prisma.community.findOne({
        where: { id }
      })
    } else if (url) {
      return ctx.prisma.community.findOne({
        where: { url }
      })
    }
  }
})

export const communities = queryField('communities', {
  type: 'Community',
  list: true,
  args: {},
  resolve: (parent, {}, ctx) => {
    return ctx.prisma.community.findMany({
      where: {
        url: { not: 'direct' }
      }
    })
  }
})

// export const followedCommunities = queryField('followedCommunities', {
//   type: 'Community',
//   list: true,
//   resolve: async (parent, args, ctx) => {
//     const userId = await getUserId(ctx)
//     return ctx.prisma.community.findMany({
//       where: {
//         members: {
//           id: userId
//         }
//       }
//     })
//   },
// })

export const searchCommunities = queryField('searchCommunities', {
  type: 'Community',
  list: true,
  args: { searchString: stringArg({ nullable: true }) },
  resolve: (parent, { searchString }, ctx) => {
    return ctx.prisma.community.findMany({
      where: {
        AND: [
          { url: { not: 'direct' } },
          {
            OR: [
              { name: { contains: searchString } },
              { description: { contains: searchString } }
            ]
          }
        ]
      }
    })
  }
})
