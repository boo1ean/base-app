import { createServer } from 'node:http'
import { migrateDb } from '@repo/db'
import { RPCHandler } from '@orpc/server/node'
import { onError } from '@orpc/server'
import { CORSPlugin } from '@orpc/server/plugins'
import { env } from './env.js'
import { router } from './router/index.js'
import { db } from './services/db.js'
import { logger } from './services/logger.js'

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
  interceptors: [
    onError((error) => {
      logger.error('Unhandled procedure error', { error })
    }),
  ],
})

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, {
    prefix: '/rpc',
    context: { headers: req.headers },
  })

  if (matched)
    return

  res.statusCode = 404
  res.end('Not found')
})

async function start() {
  logger.info('Running database migrations...')
  await migrateDb(db)
  logger.info('Migrations complete')

  server.listen(env.PORT, env.HOST, () => {
    logger.info(`API listening on http://${env.HOST}:${env.PORT}`)
  })
}

start().catch((err) => {
  logger.fatal('Failed to start', { error: err })
  process.exit(1)
})
