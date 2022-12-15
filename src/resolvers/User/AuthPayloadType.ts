import { objectType } from 'nexus'
import { User } from './UserType'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('token')
    t.nonNull.field('user', { type: User })
  }
})
