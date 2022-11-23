import { objectType } from 'nexus'
import { Channel, Community, Message, User } from '../index'
import { DateTime } from '../User/Others'

export const Notification = objectType({
  name: "Notification",
  definition(t) {
    t.string("action")
    t.string("body")
    t.field("channel", { type: Channel })
    t.field("community", { type: Community })
    t.nonNull.field("createdAt", { type: 'DateTime' })
    t.nonNull.string("id")
    t.nonNull.boolean("isRead")
    t.field("message", { type: Message })
    t.nonNull.field("receiver", { type: User })
    t.nonNull.field("sender", { type: User })
    t.string("type")
  }
})
