import { queryField, list } from 'nexus'
import { getUserId } from '../../utils'

export const roles = queryField('roles', {
  type: list('Role'),
  
  resolve: (parent, args, Context) => {
    return Context.prisma.role.findMany()
  },
})

