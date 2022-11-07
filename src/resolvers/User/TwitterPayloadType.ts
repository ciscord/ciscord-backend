import { objectType } from 'nexus'

export const TwitterPayload = objectType({
  name: 'TwitterPayload',
  definition(t) {
    t.string('followers')
    t.string('followings')
    t.string('bio')
    t.field('user', { type: 'User' })
  },
})
