import { queryField, stringArg, idArg, nullable, list } from 'nexus'
import { getUserId } from '../../utils'

export const community = queryField('community', {
  type: list('Community'),
  
  args: {
    id: nullable(idArg()),
    url: nullable(stringArg())
  },
  resolve: (parent, { id, url }, Context) => {
    if (id) {
      return Context.prisma.community.findFirst({
        where: { id }
      })
    } else if (url) {
      return Context.prisma.community.findFirst({
        where: { url }
      })
    }
  }
})

export const communities = queryField('communities', {
  type: list('Community'),
  
  args: {},
  resolve: (parent, {}, Context) => {
    return Context.prisma.community.findMany({
      where: {
        url: { not: 'direct' }
      }
    })
  }
})

// export const followedCommunities = queryField('followedCommunities', {
//   type: 'Community',
//   
//   resolve: async (parent, args, Context) => {
//     const userId = await getUserId(Context)
//     return Context.prisma.community.findMany({
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
  resolve: (parent, { searchString }, Context) => {
    return Context.prisma.community.findMany({
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
