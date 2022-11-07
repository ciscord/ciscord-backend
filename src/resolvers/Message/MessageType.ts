import { objectType } from 'nexus'

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.body()
    t.model.author()
    t.model.channel()
    t.model.children({ pagination: false })
    t.model.reactions({ pagination: false })
    t.model.attachments({ pagination: false })
    t.model.remoteAttachments({ pagination: false })
  },
})

