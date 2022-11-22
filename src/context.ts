import { PrismaClient } from '@prisma/client'
import { PubSub, createPubSub } from 'graphql-yoga'

export interface Context {
  prisma: PrismaClient
  pubsub: PubSub<any>
}

export interface Token {
  userId: string
  tenant: string
}


const prisma = new PrismaClient()
const pubsub = createPubSub()

export const context = {
  prisma,
  pubsub
}
