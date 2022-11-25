import { objectType } from 'nexus'
import { Channel, User, Notification } from '../index'

export const Community = objectType({
  name: "Community",
  definition(t) {
    t.field("author", { type: User })
    t.nonNull.list.nonNull.field("channels", { type: Channel })
    t.string("description")
    t.nonNull.string("id")
    t.string("image")
    t.nonNull.boolean("isPrivate")
    t.nonNull.list.nonNull.field("members", { type: User })
    t.nonNull.string("name")
    t.nonNull.list.nonNull.field("notifications", { type: Notification })
    t.nonNull.string("url")
  }
})