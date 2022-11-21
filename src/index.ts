const dotenv = require('dotenv')
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` })
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema } from 'nexus'
import { createYoga, createPubSub } from 'graphql-yoga'
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
import { verify } from 'jsonwebtoken'

const cors = require('cors')

let prismas = new Map()
const pubsub = createPubSub()

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

const server = new createYoga({
  schema,
  // typeDefs: `scalar Upload`,
  context: async ctx => {
    if (ctx.request) {
      const name = String(ctx.request.headers['klack-tenant'])

      try {
        return {
          ...ctx,
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
      
      try {
        return {
          ...ctx,
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
  },
  () => console.log(`🚀 Server ready`)
)

process.on('exit', async () => {

})
