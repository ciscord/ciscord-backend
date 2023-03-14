const dotenv = require('dotenv')
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` })
import { createYoga } from 'graphql-yoga'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import express from 'express'
import * as http from 'http';
import { join } from 'path'
import * as types from './resolvers'
import { Context, createContext } from './context'
import RegisterCompany from './registerCompany'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import compression from 'compression' // compresses requests
import * as bodyParser from 'body-parser'
import { makeSchema, nullabilityGuardPlugin } from 'nexus'
import getSignedUrl from './getSignedUrl'

const cors = require('cors')
const baseSchema = makeSchema({
  types: [types],
  outputs: {
    typegen: join(__dirname.replace(/\/dist$/, '/src'), './ciscord-typegen.ts'),
    schema: join(__dirname, '/schema.graphql')
  },
  contextType: {
    module: join(__dirname, 'context.ts'),
    export: 'Context'
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }]
  },
  shouldExitAfterGenerateArtifacts: Boolean(process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION),
  plugins: [
    nullabilityGuardPlugin({
      shouldGuard: true,
      fallbackValues: {
        String: () => '',
        ID: () => 'MISSING_ID',
        Boolean: () => true
      }
    })
  ]
})

// const schema = applyMiddleware(baseSchema, permissions)
const schema = applyMiddleware(baseSchema)

const app = express()


const httpServer = http.createServer(app);

async function main() {

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  })

  const serverCleanup = useServer({
    schema,
    context: createContext,
    onConnect: async (ctx) => {
      console.log('onConnect!');

    },
    onDisconnect(ctx, code, reason) {
      console.log('Disconnected!');
    },
  }, wsServer);

  const yoga = createYoga<Context, any>({
    schema: schema,
    logging: true,
    context: createContext,
    graphiql: {
      // Use graphql-sse in GraphiQL.
      subscriptionsProtocol: 'WS'
    },
    plugins: [
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  })

  // enable cors
  var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  }

  app.use('/*', cors(corsOption))
  app.use(compression())
  app.use(bodyParser.json({ type: 'application/json' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.text({ type: 'text/html' }))

  app.use('/register', RegisterCompany)
  app.use('/presign', getSignedUrl)

  app.use('/graphql', yoga)

  httpServer.listen(4000, () => {
    console.log('Server is running on port 4000')
  })

}
main();
process.on('exit', async () => { })
