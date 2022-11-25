import { objectType } from 'nexus'

export const OnlinePayload = objectType({
  name: 'OnlinePayload',
  definition(t) {
    t.string('id')
    t.string('isOnline')
    t.field('user', { type: 'User' })
  },
})
