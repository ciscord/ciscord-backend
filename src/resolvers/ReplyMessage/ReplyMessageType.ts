import { arg, intArg, objectType } from 'nexus'
import { Message, RemoteAttachment, User, File } from '../index'
import { DateTime, FileWhereUniqueInput } from '../Others'

export const ReplyMessage = objectType({
  name: "ReplyMessage",
  definition(t) {
    t.nonNull.list.nonNull.field("attachments", {
      type: File,
      args: {
        after: arg({ type: FileWhereUniqueInput }),
        before: arg({ type: FileWhereUniqueInput }),
        first: intArg(),
        last: intArg(),
        skip: intArg(),
      },
    })
    t.nonNull.field("author", { type: User })
    t.nonNull.string("body")
    t.nonNull.field("createdAt", { type: 'DateTime' })
    t.nonNull.string("id")
    t.nonNull.field("parent", { type: Message })
    t.nonNull.list.nonNull.field("remoteAttachments", { type: RemoteAttachment })
    t.nonNull.field("updatedAt", { type: 'DateTime' })
  }
})
