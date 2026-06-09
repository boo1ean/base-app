import process from 'node:process'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { consola } from 'consola'

const url = 'postgres://app:app@localhost:5432/app'
const client = postgres(url, { max: 1 })
const db = drizzle(client)

async function dropDatabase() {
  for (const schema of ['public', 'drizzle']) {
    await db.execute(sql.raw(`
      DO $$ DECLARE r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = '${schema}') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ${schema}.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `))
  }

  for (const schema of ['public', 'drizzle']) {
    await db.execute(sql.raw(`
      DO $$ DECLARE r RECORD;
      BEGIN
        FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = '${schema}') LOOP
          EXECUTE 'DROP SEQUENCE IF EXISTS ${schema}.' || quote_ident(r.sequence_name) || ' CASCADE';
        END LOOP;
      END $$;
    `))
  }

  for (const schema of ['public', 'drizzle']) {
    await db.execute(sql.raw(`
      DO $$ DECLARE r RECORD;
      BEGIN
        FOR r IN (
          SELECT typname FROM pg_type
          WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = '${schema}')
          AND typtype = 'e'
        ) LOOP
          EXECUTE 'DROP TYPE IF EXISTS ${schema}.' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `))
  }
}

const confirmed = await consola.prompt(
  `Drop all tables, sequences, and enums? (${url})`,
  { type: 'confirm' },
)

if (!confirmed) {
  consola.info('Cancelled')
  await client.end()
  process.exit(0)
}

await dropDatabase()
consola.success('Database dropped')
await client.end()
