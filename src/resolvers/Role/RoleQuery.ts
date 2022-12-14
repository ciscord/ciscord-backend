import { queryField, list } from 'nexus'

export const roles = queryField('roles', {
  type: list('Role'),
  resolve: (parent, args, ctx) => {
    return ctx.prisma.role.findMany()
  },
})

