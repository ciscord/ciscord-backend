import { arg, intArg, objectType } from 'nexus'
import { Message, RemoteAttachment, User, UFile } from '../index'

export const ReplyMessage = objectType({
  name: 'ReplyMessage',
  definition(t) {
    t.nonNull.field('author', { type: User })
    t.nonNull.string('body')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.string('id')
    t.nonNull.field('parent', { type: Message })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.list.nonNull.string('urlList')
  }
})
