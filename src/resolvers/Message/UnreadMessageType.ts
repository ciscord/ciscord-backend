import { objectType } from 'nexus'

export const UnreadMessagePayload = objectType({
  name: 'UnreadMessagePayload',
  definition(t) {
    t.boolean('fromNewUser')
    t.list.field('messages', { type: 'Message' })
    t.field('user', { type: 'User' })
  },
})
