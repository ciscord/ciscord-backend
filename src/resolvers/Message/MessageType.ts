import { objectType } from 'nexus'
import { Channel, Reaction, ReplyMessage, User } from '../index'

export const Message = objectType({
  name: 'Message',
  definition(t) {
    t.nonNull.field('author', { type: User })
    t.string('body')
    t.field('channel', { type: Channel })
    t.nonNull.list.nonNull.field('children', { type: ReplyMessage })
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.string('id')
    t.nonNull.list.nonNull.field('reactions', { type: Reaction })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.list.nonNull.string('urlList')
  }
})
