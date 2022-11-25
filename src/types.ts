import { PrismaClient } from '@prisma/client'
import { PubSub } from 'graphql-yoga'

export interface Context {
  prisma: PrismaClient
  pubsub: PubSub
  request: any
  initPromise: any
}

export interface Token {
  userId: string
  tenant: string
}
