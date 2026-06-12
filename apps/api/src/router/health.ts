import { os } from '@orpc/server'
import * as z from 'zod'

export const health = os
  .output(z.object({
    status: z.literal('ok'),
    uptime: z.number(),
    timestamp: z.string(),
  }))
  .handler(() => ({
    status: 'ok' as const,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }))
