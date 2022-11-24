import { arg, intArg, objectType } from "nexus";
import { Channel, ChannelInfo, Notification, File, Community, Message, Reaction, ReplyMessage, Role } from "../index";
import { NotificationWhereUniqueInput } from "../Others";
import { ReplyMessageWhereUniqueInput } from "../Others";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("bio")
    t.nonNull.list.nonNull.field("channelsInfo", { type: ChannelInfo })
    t.nonNull.list.nonNull.field("communitiesFollowed", { type: Community })
    t.nonNull.list.nonNull.field("communitiesOwned", { type: Community })
    t.field("currentChannel", { type: Channel })
    t.string("email")
    t.nonNull.list.nonNull.field("files", { type: File })
    t.nonNull.string("fullname")
    t.nonNull.string("id")
    t.string("image")
    t.nonNull.boolean("isOnline")
    t.nonNull.list.nonNull.field("messages", { type: Message })
    t.nonNull.list.nonNull.field("notificationsReceived", {
      type: Notification,
      args: {
        after: arg({ type: NotificationWhereUniqueInput }),
        before: arg({ type: NotificationWhereUniqueInput }),
        first: intArg(),
        last: intArg(),
        skip: intArg(),
      },
    })
    t.nonNull.list.nonNull.field("notificationsSend", {
      type: Notification,
      args: {
        after: arg({ type: NotificationWhereUniqueInput }),
        before: arg({ type: NotificationWhereUniqueInput }),
        first: intArg(),
        last: intArg(),
        skip: intArg(),
      },
    })
    t.string("owner")
    t.string("password")
    t.nonNull.list.nonNull.field("reactions", { type: Reaction })
    t.nonNull.list.nonNull.field("replyMessages", {
      type: ReplyMessage,
      args: {
        after: arg({ type: ReplyMessageWhereUniqueInput }),
        before: arg({ type: ReplyMessageWhereUniqueInput }),
        first: intArg(),
        last: intArg(),
        skip: intArg(),
      },
    })
    t.nonNull.list.nonNull.field("role", { type: Role })
    t.string("social")
    t.nonNull.string("username")
  }
});
