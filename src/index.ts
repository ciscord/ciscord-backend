const dotenv = require('dotenv')
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` })
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { join } from 'path'
import * as allTypes from './resolvers'
import { createContext } from './types'
import SocialConfig from './passport'
import RegisterCompany from './registerCompany'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import * as compression from 'compression' // compresses requests
import * as bodyParser from 'body-parser'
import { PrismaClient } from '@prisma/client'
import { verify } from 'jsonwebtoken'
import {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType
} from 'nexus'

const cors = require('cors')

const prisma = new PrismaClient()

const baseSchema = makeSchema({
  types: [allTypes],
  outputs: {
    typegen: join(__dirname, '../generated/nexus-typegen.ts'),
    schema: join(__dirname, '/schema.graphql')
  },
  contextType: {
    module: require.resolve('./types'),
    export: 'Context'
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma'
      }
    ]
  }
})

const schema = applyMiddleware(baseSchema, permissions)

const yoga = new createYoga({
  schema,
  context: createContext
})
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga)

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
    }
  },
  () => console.log(`🚀 Server ready`)
)

process.on('exit', async () => {
  await prisma.$disconnect()
})
