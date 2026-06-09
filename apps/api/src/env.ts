import process from 'node:process'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging', 'test']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('pretty'),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
