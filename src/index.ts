const dotenv = require('dotenv')
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` })
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema } from 'nexus'
import { GraphQLServer, PubSub } from 'graphql-yoga'
import { join } from 'path'
import * as allTypes from './resolvers'
import { Context, Token } from './types'
import SocialConfig from './passport'
import RegisterCompany from './registerCompany'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import * as compression from 'compression' // compresses requests
import * as bodyParser from 'body-parser'
import { PrismaClient } from '@prisma/client';
import { MultiTenant } from 'prisma-multi-tenant'
import { verify } from 'jsonwebtoken'

const multiTenant = new MultiTenant<PrismaClient>();

const cors = require('cors')

let prismas = new Map()
const pubsub = new PubSub()

const nexusPrisma = nexusPrismaPlugin();

const baseSchema = makeSchema({
  types: [allTypes],
  plugins: [nexusPrisma],
  outputs: {
    typegen: join(__dirname, '../generated/nexus-typegen.ts'),
    schema: join(__dirname, '/schema.graphql')
  },
  typegenAutoConfig: {
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma"
      },
      {
        source: join(__dirname, 'types.ts'),
        alias: 'ctx'
      }
    ],
    contextType: 'ctx.Context'
  }
})

const schema = applyMiddleware(baseSchema, permissions)

const server = new GraphQLServer({
  schema,
  // typeDefs: `scalar Upload`,
  context: async ctx => {
    if (ctx.request) {
      const name = String(ctx.request.headers['klack-tenant'])

      try {
        let prisma
        if (prismas.get(name)) {
          if (prismas.get(name) === '1') {
            while (prismas.get(name) === '1') {
              await new Promise(r => setTimeout(r, 1000))
            }
            console.log(`${name} is new ${prismas.get(name)}`)
          } else {
            console.log(`${name} is already ${prismas.get(name)}`)
          }
          prisma = await multiTenant.get(name)
        } else {
          prismas.set(name, '1')
          prisma = await multiTenant.get(name)
          prismas.set(name, '2')
        }

        return {
          ...ctx,
          prisma,
          pubsub
        }
      } catch (err) {
        console.log(name, 'NO1')
        return {
          ...ctx,
          pubsub
        }
      }
    } else {
      const name = ctx.connection.variables.tenant

      try {
        let prisma
        if (prismas.get(name)) {
          if (prismas.get(name) === '1') {
            while (prismas.get(name) === '1') {
              await new Promise(r => setTimeout(r, 1000))
            }
            console.log(`${name} is new ${prismas.get(name)}`)
          } else {
            console.log(`${name} is already ${prismas.get(name)}`)
          }
          prisma = await multiTenant.get(name)
        } else {
          prismas.set(name, '1')
          prisma = await multiTenant.get(name)
          prismas.set(name, '2')
        }
        return {
          ...ctx,
          prisma,
          pubsub
        }
      } catch (err) {
        console.log(name, 'NO')
        return {
          ...ctx,
          pubsub
        }
      }
    }
  }
})

// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}

server.express.use('/*', cors(corsOption))
server.express.use(compression())
server.express.use(bodyParser.json({ type: 'application/json' }))
server.express.use(bodyParser.urlencoded({ extended: true }))
server.express.use(bodyParser.text({ type: 'text/html' }))

SocialConfig.configure(server)

server.express.use('/register', RegisterCompany)

////////// ----------- //////////
server.start(
  {
    endpoint: '/graphql',
    playground: '/graphql',
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    },
    subscriptions: {
      onConnect: async (
        { token }: { token: string },
        ws: Object,
        context: Context
      ) => {
        if (token) {
          try {
            const verifiedToken = verify(token, process.env['APP_SECRET']) as Token
            const userId = verifiedToken && verifiedToken.userId
            const tenant = verifiedToken && verifiedToken.tenant
            if (userId && tenant) {
              const prisma = await multiTenant.get(tenant)
              if (prisma.user) {
                const user = await prisma.user.update({
                  where: { id: userId },
                  data: { isOnline: true },
                })
                pubsub.publish('USER_WENT_ONLINE', { user, tenant })
                return user
              }
            }
          } catch (error) {
            return;
          }
        }
      },
      onDisconnect: async (ws: Object, context: Context) => {
        if (context.request.headers.cookie) {
          try {
            let token = context.request.headers.cookie
            token = token.slice(token.lastIndexOf('token=') + 6)
            const verifiedToken = verify(token, process.env['APP_SECRET']) as Token
            const userId = verifiedToken && verifiedToken.userId
            const tenant = verifiedToken && verifiedToken.tenant
            if (userId && tenant) {
              const prisma = await multiTenant.get(tenant)
              if (prisma.user) {
                const user = await prisma.user.update({
                  where: { id: userId },
                  data: { isOnline: false },
                })
                pubsub.publish('USER_WENT_OFFLINE', { user, tenant })
                return user
              }
            }
          } catch (error) {
            return;
          }
        }
      }
    }
  },
  () => console.log(`🚀 Server ready`)
)

process.on('exit', async () => {
  await multiTenant.disconnect()
})
