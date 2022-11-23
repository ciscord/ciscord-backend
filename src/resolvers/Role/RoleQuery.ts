import { queryField, stringArg } from 'nexus'
import { getUserId } from '../../utils'

export const roles = queryField('roles', {
  type: 'Role',
  
  resolve: (parent, args, Context) => {
    return Context.prisma.role.findMany()
  },
})

