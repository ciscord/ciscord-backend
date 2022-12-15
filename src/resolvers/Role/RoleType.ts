import { arg, intArg, objectType } from 'nexus'
import { User } from '../index'
import { UserWhereUniqueInput, DateTime } from '../Others'

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.nonNull.string('color')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.string('id')
    t.nonNull.string('roleSettings')
    t.nonNull.string('title')
    t.nonNull.list.nonNull.field('users', {
      type: User,
      args: {
        after: arg({ type: UserWhereUniqueInput }),
        before: arg({ type: UserWhereUniqueInput }),
        first: intArg(),
        last: intArg(),
        skip: intArg()
      }
    })
  }
})
