import { queryField, list } from 'nexus'

export const roles = queryField('roles', {
  type: list('Role'),
  resolve: (parent, args, Context) => {
    return Context.prisma.role.findMany()
  },
})

