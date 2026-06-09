import { createDb } from '@repo/db'
import { env } from '../env.js'

export const db = createDb({ connectionString: env.DATABASE_URL })
