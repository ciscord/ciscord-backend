import { objectType } from 'nexus'
import { User } from '../index'
import { Message } from './MessageType'

export const UnreadMessagePayload = objectType({
  name: "UnreadMessagePayload",
  definition(t) {
    t.nonNull.boolean("fromNewUser")
    t.nonNull.list.nonNull.field("messages", { type: Message })
    t.nonNull.field("user", { type: User })
  }
})
