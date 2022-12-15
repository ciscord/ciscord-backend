import { PrismaClient } from '@prisma/client'
import { YogaInitialContext } from 'graphql-yoga'
import { RedisPubSub } from 'graphql-redis-subscriptions'

export interface Context extends YogaInitialContext {
  prisma: PrismaClient
  pubsub: RedisPubSub
}

export interface Token {
  userId: string
  tenant: string
}

const prisma = new PrismaClient()
const pubsub = new RedisPubSub()

export const context = {
  prisma,
  pubsub
}
