import { objectType, stringArg } from 'nexus'

export const TypingStatus = objectType({
  name: 'TypingStatus',
  definition(t) {
    t.nonNull.boolean('isTyping')
    t.nonNull.string('username')
  }
})
