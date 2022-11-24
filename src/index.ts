const dotenv = require('dotenv')
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` })
// import { ApolloServer } from 'apollo-server-express'
// import express from 'express'
import { createYoga,  } from 'graphql-yoga';
import { createServer } from 'node:http';
import { join } from 'path'
import * as types from './resolvers'
import { context } from './context'
import SocialConfig from './passport'
import RegisterCompany from './registerCompany'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import * as compression from 'compression' // compresses requests
import * as bodyParser from 'body-parser'
import { verify } from 'jsonwebtoken'
import { makeSchema, nullabilityGuardPlugin } from 'nexus'

const cors = require('cors')
const baseSchema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname.replace(/\/dist$/, '/src'), './ciscord-typegen.ts'),
    schema: join(__dirname, '/schema.graphql')
  },
  contextType: {
    module: join(__dirname, "context.ts"),
    export: 'Context'
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
  shouldExitAfterGenerateArtifacts: Boolean(
    process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION,
  ),
  plugins: [
    nullabilityGuardPlugin({
      shouldGuard: true,
      fallbackValues: {
        String: () => '',
        ID: () => 'MISSING_ID',
        Boolean: () => true,
      },
    }),
  ],
})

const schema = applyMiddleware(baseSchema)
// const schema = applyMiddleware(baseSchema, permissions)

// const apollo = new ApolloServer({
//   context: () => ({ context }),
//   schema: baseSchema
// })

// const app = express()

// apollo.applyMiddleware({ app })

// app.listen(4000, () => {
//   console.log(`🚀 GraphQL service ready at http://localhost:4000/graphql`)
// })

const yoga = createYoga({ schema, context })

// Pass it into a server to hook into request handlers.
const server = createServer(yoga)



// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}

// server.express.use('/*', cors(corsOption))
// server.express.use(compression())
// server.express.use(bodyParser.json({ type: 'application/json' }))
// server.express.use(bodyParser.urlencoded({ extended: true }))
// server.express.use(bodyParser.text({ type: 'text/html' }))

// SocialConfig.configure(server)

// server.express.use('/register', RegisterCompany)

////////// ----------- //////////
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})

// server.start(
//   {
//     endpoint: '/graphql',
//     playground: '/graphql',
//     cors: {
//       credentials: true,
//       origin: process.env.FRONTEND_URL
//     }
//   },
//   () => console.log(`🚀 Server ready`)
// )

process.on('exit', async () => {

})
