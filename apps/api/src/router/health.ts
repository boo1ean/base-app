import { checkDbConnection } from '@repo/db'
import { os } from '@orpc/server'
import * as z from 'zod'

import { db } from '../services/db.js'

export const health = os
  .output(z.object({
    status: z.literal('ok'),
    uptime: z.number(),
    timestamp: z.string(),
    checks: z.object({
      postgres: z.enum(['up', 'down']),
    }),
  }))
  .handler(async () => {
    let postgres: 'up' | 'down' = 'down'
    try {
      await checkDbConnection(db)
      postgres = 'up'
    }
    catch {}

    return {
      status: 'ok' as const,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: { postgres },
    }
  })
