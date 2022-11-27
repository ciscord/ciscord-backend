import { PrismaClient } from '@prisma/client'
import { PubSub, createPubSub, YogaInitialContext } from 'graphql-yoga'
export interface Context  extends YogaInitialContext {
  prisma: PrismaClient
  pubsub: PubSub<any>
}

export interface Token {
  userId: string
  tenant: string
}

const prisma = new PrismaClient()
const pubsub = createPubSub<{
  newMessage: any
}>()

export const context = {
  prisma,
  pubsub
}
