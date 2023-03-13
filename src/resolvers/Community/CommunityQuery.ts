import { queryField, stringArg, idArg, nullable, list } from 'nexus'

export const community = queryField('community', {
  type: 'Community',
  args: {
    id: nullable(idArg()),
    url: nullable(stringArg())
  },
  resolve: (parent, { id, url }, ctx) => {
    if (id) {
      return ctx.prisma.community.findFirst({
        where: { id }
      })
    } else if (url) {
      return ctx.prisma.community.findFirst({
        where: { url }
      })
    }
  }
})

export const communities = queryField('communities', {
  type: list('Community'),
  args: {},
  resolve: (parent, {}, ctx) => {
    return ctx.prisma.community.findMany({
      where: {
        url: { not: 'direct' }
      },
      include: { channels: true },
    })
  }
})

// export const followedCommunities = queryField('followedCommunities', {
//   type: 'Community',
//
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
  type: list('Community'),
  args: { searchString: nullable(stringArg()) },
  resolve: (parent, { searchString }, ctx) => {
    return ctx.prisma.community.findMany({
      where: {
        AND: [
          { url: { not: 'direct' } },
          {
            OR: [{ name: { contains: searchString } }, { description: { contains: searchString } }]
          }
        ]
      }
    })
  }
})
