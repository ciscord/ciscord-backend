import { mutationField, stringArg, nullable, nonNull } from 'nexus'

export const createRole = mutationField('createRole', {
  type: 'Role',
  args: {
    title: stringArg(),
    roleSettings: stringArg(),
    color: nullable(stringArg())
  },
  resolve: (_parent, { title, roleSettings, color }, ctx) => {
    return ctx.prisma.role.create({
      data: {
        title,
        roleSettings,
        color
      }
    })
  }
})

export const updateRole = mutationField('updateRole', {
  type: 'Role',
  args: {
    id: stringArg(),
    title: stringArg(),
    roleSettings: stringArg(),
    color: nullable(stringArg())
  },
  resolve: (_parent, { title, roleSettings, color, id }, ctx) => {
    return ctx.prisma.role.update({
      where: { id },
      data: {
        title,
        roleSettings,
        color
      }
    })
  }
})

export const deleteRole = mutationField('deleteRole', {
  type: 'Role',
  args: {
    id: stringArg()
  },
  resolve: (_parent, { id }, ctx) => {
    return ctx.prisma.role.delete({
      where: { id }
    })
  }
})

export const attachRoleToUser = mutationField('attachRoleToUser', {
  type: 'User',
  args: {
    userId: nonNull(stringArg()),
    roleId: nullable(stringArg())
  },
  resolve: async (parent, { userId, roleId }, ctx) => {
    const user = await ctx.prisma.user.update({
      where: { id: userId },
      data: { role: { connect: { id: roleId } } }
    })
    return user
  }
})

export const deattachRoleToUser = mutationField('deattachRoleToUser', {
  type: 'User',
  args: {
    userId: nonNull(stringArg()),
    roleId: nonNull(stringArg())
  },
  resolve: async (parent, { userId, roleId }, ctx) => {
    const user = await ctx.prisma.user.update({
      where: { id: userId },
      data: { role: { disconnect: { id: roleId } } }
    })
    return user
  }
})
