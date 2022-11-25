import { objectType } from 'nexus'

export const RemoteAttachment = objectType({
  name: 'RemoteAttachment',
  definition(t) {
    t.model.id()
    t.model.title()
    t.model.description()
    t.model.preview()
    t.model.videoLink()
    t.model.url()
    t.model.siteName()
    t.model.parentMessage()
    t.model.parentReplyMessage()
  },
})

