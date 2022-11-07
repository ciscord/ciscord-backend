import { objectType } from 'nexus'

export const ReplyMessage = objectType({
  name: 'ReplyMessage',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.body()
    t.model.author()
    t.model.attachments()
    t.model.parent()
    t.model.remoteAttachments({ pagination: false })
  },
})

