import { createServer } from 'node:http'
import { OpenAPIHandler } from '@orpc/openapi/node'
import { onError } from '@orpc/server'
import { CORSPlugin } from '@orpc/server/plugins'
import { router } from './router/index.js'

const handler = new OpenAPIHandler(router, {
  plugins: [new CORSPlugin()],
  interceptors: [
    onError(error => console.error(error)),
  ],
})

const host = process.env.HOST ?? '0.0.0.0'
const port = Number(process.env.PORT ?? 3000)

const server = createServer(async (req, res) => {
  const { matched } = await handler.handle(req, res, {
    context: { headers: req.headers },
  })

  if (matched)
    return

  res.statusCode = 404
  res.end('Not found')
})

server.listen(port, host, () => {
  console.warn(`API listening on http://${host}:${port} (GET /health)`)
})
