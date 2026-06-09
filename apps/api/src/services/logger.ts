import { createAppLogger } from '@repo/logger'
import { env } from '../env.js'

export const logger = createAppLogger({
  app: 'api',
  level: env.LOG_LEVEL,
  format: env.LOG_FORMAT,
})
