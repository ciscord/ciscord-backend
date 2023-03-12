import { PrismaClient } from "@prisma/client";
import { createPubSub } from 'graphql-yoga';

const prisma = new PrismaClient();
export const pubsub = createPubSub();

export type Context = {
  prisma: PrismaClient;
  pubsub: typeof pubsub;
};

export const context = {
  prisma,
  pubsub,
}
