#!/usr/bin/env node
/**
 * Migrates data from Supabase Postgres (source) to local Postgres (target).
 * - Reads from schemas: auth, public (Supabase)
 * - Writes to schema: public (target)
 *
 * Requirements:
 * - Set SUPABASE_DB_URL env var with connection string to Supabase Postgres
 *   Example: postgres://postgres:<PASSWORD>@db.<project>.supabase.co:5432/postgres
 * - Running docker compose (db + app). Run this inside the app container:
 *   docker compose exec -e SUPABASE_DB_URL="<url>" app node scripts/migrate-from-supabase.mjs
 */
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

function log(section, msg) {
  console.log(`[${section}] ${msg}`)
}

// Adiciona suporte ao flag CLI --only=users
const onlyArg = process.argv.find(a => a.startsWith('--only='))
const ONLY = onlyArg ? onlyArg.split('=')[1] : null

const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL
if (!SUPABASE_DB_URL) {
  console.error('ERROR: SUPABASE_DB_URL não foi definido. Informe a string de conexão do Postgres do Supabase.')
  process.exit(1)
}

// Self-hosted: usar SSL somente se explicitamente requerido
let useSSL = false
try {
  const url = new URL(SUPABASE_DB_URL)
  const sslmode = url.searchParams.get('sslmode')
  if (sslmode && sslmode.toLowerCase() === 'require') useSSL = true
} catch {}
if (process.env.SUPABASE_USE_SSL === 'true') useSSL = true

const supaPool = new Pool({
  connectionString: SUPABASE_DB_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
})

// Target DB (local docker service "db")
const targetPool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hidrofitness',
})

async function migrateUsersAndProfiles() {
  const supa = await supaPool.connect()
  const target = await targetPool.connect()
  try {
    log('users', 'Lendo auth.users + public.profiles do Supabase...')
    const { rows } = await supa.query(
      `SELECT u.id, u.email, p.full_name, p.avatar_url, COALESCE(p.role, 'user') AS role, p.updated_at
       FROM auth.users u
       LEFT JOIN public.profiles p ON p.id = u.id`
    )

    log('users', `Migrando ${rows.length} usuários...`)
    const upsertUser = `
      INSERT INTO public.users (id, email, password_hash, full_name, avatar_url, role, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, now())
      ON CONFLICT (id)
      DO UPDATE SET email = EXCLUDED.email,
                    full_name = EXCLUDED.full_name,
                    avatar_url = EXCLUDED.avatar_url,
                    role = EXCLUDED.role
    `
    const upsertProfile = `
      INSERT INTO public.profiles (id, full_name, avatar_url, role, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id)
      DO UPDATE SET full_name = EXCLUDED.full_name,
                    avatar_url = EXCLUDED.avatar_url,
                    role = EXCLUDED.role,
                    updated_at = EXCLUDED.updated_at
    `

    for (const r of rows) {
      // password_hash será NULL (exige redefinição posterior)
      await target.query(upsertUser, [r.id, r.email, null, r.full_name, r.avatar_url, r.role])
      await target.query(upsertProfile, [r.id, r.full_name, r.avatar_url, r.role, r.updated_at])
    }
    log('users', 'Concluído.')
  } finally {
    supa.release()
    target.release()
  }
}

async function getTableColumns(client, schema, table) {
  const { rows } = await client.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema=$1 AND table_name=$2
     ORDER BY ordinal_position`,
    [schema, table]
  )
  return rows.map(r => r.column_name)
}

async function migrateTablePublic(table) {
  const supa = await supaPool.connect()
  const target = await targetPool.connect()
  try {
    const columns = await getTableColumns(supa, 'public', table)
    // Ensure id exists to deduplicate
    const hasId = columns.includes('id')

    log(table, `Lendo dados do Supabase (public.${table})...`)
    const { rows } = await supa.query(`SELECT ${columns.map(c => '"'+c+'"').join(', ')} FROM public."${table}"`)
    log(table, `Migrando ${rows.length} registros...`)

    if (rows.length === 0) return

    // Build parameterized INSERT
    const colList = columns.map(c => '"'+c+'"').join(', ')
    const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ')
    const onConflict = hasId ? ` ON CONFLICT (id) DO NOTHING` : ''
    const insertSQL = `INSERT INTO public."${table}" (${colList}) VALUES (${valuePlaceholders})${onConflict}`

    for (const row of rows) {
      const values = columns.map(c => row[c])
      await target.query(insertSQL, values)
    }
    log(table, 'Concluído.')
  } finally {
    supa.release()
    target.release()
  }
}

async function seedPaymentMethodsFromPayments() {
  const supa = await supaPool.connect()
  const target = await targetPool.connect()
  try {
    log('payment_methods', 'Coletando métodos distintos de payments.payment_method...')
    const { rows } = await supa.query(
      `SELECT DISTINCT payment_method FROM public.payments WHERE payment_method IS NOT NULL`
    )
    const names = rows.map(r => r.payment_method).filter(Boolean)
    log('payment_methods', `Inserindo ${names.length} métodos...`)
    for (const name of names) {
      await target.query(
        `INSERT INTO public.payment_methods (name, created_at) VALUES ($1, now())
         ON CONFLICT DO NOTHING`,
        [name]
      )
    }
    log('payment_methods', 'Concluído.')
  } finally {
    supa.release()
    target.release()
  }
}

async function countTarget(table) {
  const target = await targetPool.connect()
  try {
    const { rows } = await target.query(`SELECT COUNT(*) AS c FROM public."${table}"`)
    return Number(rows[0].c)
  } finally {
    target.release()
  }
}

'use strict'

async function main() {
  log('start', 'Iniciando migração do Supabase → Postgres local')
  await migrateUsersAndProfiles()

  if (ONLY === 'users') {
    const summaryTables = ['users','profiles']
    for (const t of summaryTables) {
      const c = await countTarget(t)
      log('summary', `${t}: ${c} registros no destino`)
    }
    log('done', 'Migração de usuários e perfis concluída (--only=users).')
    return
  }

  // Order matters due to FKs
  const orderedTables = [
    'students',
    'instructors',
    'modalities',
    'classes',
    'enrollments',
    'payments',
    'equipments',
    'maintenance_schedules',
    'plans',
    'student_plans',
  ]

  for (const t of orderedTables) {
    await migrateTablePublic(t)
  }

  await seedPaymentMethodsFromPayments()

  // Summary
  const summaryTables = ['users','profiles', ...orderedTables, 'payment_methods']
  for (const t of summaryTables) {
    const c = await countTarget(t)
    log('summary', `${t}: ${c} registros no destino`)
  }

  log('done', 'Migração concluída.')
}

main().catch(err => {
  console.error('Migration error:', err)
  process.exit(1)
})