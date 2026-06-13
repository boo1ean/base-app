import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate as drizzleMigrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as schema from './schema/index.js'

export type Database = ReturnType<typeof createDb>

export interface DbOptions {
  connectionString: string
}

export function createDb(options: DbOptions) {
  const client = postgres(options.connectionString)
  return drizzle(client, { schema })
}

const migrationsFolder = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../drizzle',
)

export async function migrateDb(db: Database) {
  await drizzleMigrate(db, { migrationsFolder })
}

export async function checkDbConnection(db: Database): Promise<void> {
  await db.execute(sql`SELECT 1`)
}

export { schema }
