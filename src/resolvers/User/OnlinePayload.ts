import { objectType } from 'nexus'
import { User } from './UserType'

export const OnlinePayload = objectType({
  name: "OnlinePayload",
  definition(t) {
    t.nonNull.string("id")
    t.nonNull.string("isOnline")
    t.nonNull.field("user", { type: User })
  }
})
