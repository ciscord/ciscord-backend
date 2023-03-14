import { objectType } from 'nexus'
import { Channel, Reaction, UFile, RemoteAttachment, ReplyMessage, User } from '../index'
import { DateTime } from '../Others'

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.nonNull.list.nonNull.field('attachments', { type: UFile })
    t.nonNull.field('author', { type: User })
    t.string('body')
    t.field('channel', { type: Channel })
    t.nonNull.list.nonNull.field('children', { type: ReplyMessage })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.string('id')
    t.nonNull.list.nonNull.field('reactions', { type: Reaction })
    t.nonNull.list.nonNull.field('remoteAttachments', { type: RemoteAttachment })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
  }
})
