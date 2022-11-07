import { objectType } from 'nexus'

export const Community = objectType({
  name: 'Community',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.url()
    t.model.isPrivate()
    t.model.image()
    t.model.description()
    t.model.author()
    t.model.members({ pagination: false })
    t.model.channels({ pagination: false })
    t.model.notifications({ pagination: false })
  },
})
