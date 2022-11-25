import { objectType } from 'nexus'
import { User } from './UserType'

export const TwitterPayload = objectType({
  name: "TwitterPayload",
  definition(t) {
    t.nonNull.string("bio")
    t.nonNull.string("followers")
    t.nonNull.string("followings")
    t.nonNull.field("user", { type: User })
  }
})