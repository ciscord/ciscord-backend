const dotenv = require('dotenv')
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` })
import { createYoga } from 'graphql-yoga'
import express from 'express'
import { join } from 'path'
import * as types from './resolvers'
import { Context, context } from './context'
import RegisterCompany from './registerCompany'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import compression from 'compression' // compresses requests
import * as bodyParser from 'body-parser'
import { makeSchema, nullabilityGuardPlugin } from 'nexus'

const cors = require('cors')
const baseSchema = makeSchema({
  types,
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

const yoga = createYoga<Context, any>({
  schema: schema,
  logging: true,
  context
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

// SocialConfig.configure(app)

app.use('/register', RegisterCompany)

app.use('/graphql', yoga)

app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql')
})

process.on('exit', async () => {})
