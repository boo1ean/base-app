import process from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { consola } from 'consola'

const url = 'postgres://app:app@localhost:5432/app'
const client = postgres(url, { max: 1 })
const db = drizzle(client)

const migrationsFolder = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../drizzle',
)

const confirmed = await consola.prompt(
  `Drop and recreate database from migrations? (${url})`,
  { type: 'confirm' },
)

if (!confirmed) {
  consola.info('Cancelled')
  await client.end()
  process.exit(0)
}

await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`)
await db.execute(sql`DROP SCHEMA public CASCADE`)
await db.execute(sql`CREATE SCHEMA public`)
consola.success('Schema dropped')

await migrate(db, { migrationsFolder })
consola.success('Migrations applied')

await client.end()
