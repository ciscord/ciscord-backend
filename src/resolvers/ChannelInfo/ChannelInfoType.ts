import { objectType } from 'nexus'
import { Channel, User } from '../index'
import { DateTime } from '../User/Others'

export const ChannelInfo = objectType({
  name: "ChannelInfo",
  definition(t) {
    t.nonNull.field("channel", { type: Channel })
    t.nonNull.string("id")
    t.nonNull.field("lastUpdateAt", { type: DateTime })
    t.nonNull.string("uniqueUserChannelPair")
    t.nonNull.field("user", { type: User })
  }
})
