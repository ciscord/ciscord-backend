import { mutationField, stringArg, nullable, nonNull } from 'nexus'
import { Role } from '../index';

export const createRole = mutationField('createRole', {
  type: Role,
  args: {
    title: stringArg(),
    roleSettings: stringArg(),
    color: nullable(stringArg()),
  },
  resolve: (_parent, {
    title,
    roleSettings,
    color,
  }, Context) => {

    return Context.prisma.role.create({
      data: {
        title,
        roleSettings,
        color
      },
    })
  },
})

export const updateRole = mutationField('updateRole', {
  type: Role,
  args: {
    id: stringArg(),
    title: stringArg(),
    roleSettings: stringArg(),
    color: nullable(stringArg()),
  },
  resolve: (_parent, {
    title,
    roleSettings,
    color,
    id,
  }, Context) => {

    return Context.prisma.role.update({
      where: { id },
      data: {
        title,
        roleSettings,
        color
      }
    })
  },
})


export const deleteRole = mutationField('deleteRole', {
  type: 'Role',
  args: {
    id: stringArg(),
  },
  resolve: (_parent, {
    id,
  }, Context) => {

    return Context.prisma.role.delete({
      where: { id },
    })
  },
})

export const attachRoleToUser = mutationField('attachRoleToUser', {
  type: 'User',
  args: { 
    userId: nonNull(stringArg()),
    roleId: nullable(stringArg())
  } ,
  resolve: async (parent, { userId, roleId }, Context) => {
    const user = await Context.prisma.user.update({
      where: { id: userId },
      data: { role: { connect: { id: roleId } }, },
    });
    return user
  },
})

export const deattachRoleToUser = mutationField('deattachRoleToUser', {
  type: 'User',
  args: { 
    userId: nonNull(stringArg()),
    roleId: nonNull(stringArg()) 
  } ,
  resolve: async (parent, { userId, roleId }, Context) => {
    const user = await Context.prisma.user.update({
      where: { id: userId },
      data: { role: { disconnect: { id: roleId } }, },
    });
    return user
  },
})