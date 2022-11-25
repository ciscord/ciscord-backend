import { queryField, stringArg } from 'nexus'
import { getUserId } from '../../utils'

export const roles = queryField('roles', {
  type: 'Role',
  list: true,
  resolve: (parent, args, ctx) => {
    return ctx.prisma.role.findMany()
  },
})

