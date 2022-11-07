import { objectType } from 'nexus'

export const Notification = objectType({
  name: 'Notification',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.isRead()
    t.model.body()
    t.model.type()
    t.model.action()
    t.model.sender()
    t.model.receiver()
    t.model.message()
    t.model.channel()
    t.model.community()
  },
})
