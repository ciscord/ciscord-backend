import { objectType } from 'nexus'
import { Message, User } from '../index'
// import { DateTime } from '../User/Others'

export const Reaction = objectType({
  name: "Reaction",
  definition(t) {
    t.nonNull.field("createdAt", { type: 'DateTime' })
    t.nonNull.string("id")
    t.nonNull.field("message", { type: Message })
    t.nonNull.string("name")
    t.nonNull.field("updatedAt", { type: 'DateTime' })
    t.nonNull.list.nonNull.field("users", { type: User })
  }
})