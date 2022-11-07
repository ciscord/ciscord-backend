import { objectType } from 'nexus'

export const Reaction = objectType({
  name: 'Reaction',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.createdAt()
    t.model.updatedAt()
    t.model.users({ pagination: false })
    t.model.message()
  }
});

