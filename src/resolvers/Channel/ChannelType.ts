import { arg, intArg, objectType } from 'nexus'
import { ChannelInfo, Community, Message, User, Notification } from '../index'
import { ChannelInfoWhereUniqueInput, DateTime, UserWhereUniqueInput } from '../Others'

export const Channel = objectType({
  name: "Channel",
  definition(t) {
    t.field("author", { type: User })
    t.field("currentChannel", { type: User })
    t.nonNull.field("community", { type: Community })
    t.nonNull.field("createdAt", { type: 'DateTime' })
    t.string("description")
    t.nonNull.string("id")
    t.nonNull.boolean("isPrivate")
    t.nonNull.list.nonNull.field("messages", { type: Message })
    t.nonNull.string("name")
    t.nonNull.list.nonNull.field("notifications", { type: Notification })
    t.nonNull.list.nonNull.field("typingUsers", {
      type: User,
      args: {
        after: arg({ type: UserWhereUniqueInput }),
        before: arg({ type: UserWhereUniqueInput }),
        first: intArg(),
        last: intArg(),
        skip: intArg(),
      },
    })
    t.nonNull.string("url")
    t.nonNull.list.nonNull.field("userData", {
      type: ChannelInfo,
      args: {
        after: arg({ type: ChannelInfoWhereUniqueInput }),
        before: arg({ type: ChannelInfoWhereUniqueInput }),
        first: intArg(),
        last: intArg(),
        skip: intArg(),
      },
    })
  }
})