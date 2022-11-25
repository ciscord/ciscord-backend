import { objectType } from 'nexus'

export const ChannelInfo = objectType({
  name: 'ChannelInfo',
  definition(t) {
    t.model.id()
    t.model.channel()
    t.model.lastUpdateAt()
    t.model.uniqueUserChannelPair()
    t.model.user()
  },
})
