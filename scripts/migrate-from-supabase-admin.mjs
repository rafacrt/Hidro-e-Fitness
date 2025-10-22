#!/usr/bin/env node
/**
 * Migra dados do Supabase (self-hosted) via API admin + REST para o Postgres local.
 * Não requer acesso direto ao Postgres remoto.
 *
 * Requer:
 *  - SUPABASE_URL (ex.: https://supabase.app.rajo.com.br)
 *  - SUPABASE_SERVICE_ROLE_KEY (chave service role)
 *
 * Uso:
 *  docker compose exec \
 *    -e SUPABASE_URL="https://supabase.app.rajo.com.br" \
 *    -e SUPABASE_SERVICE_ROLE_KEY="<service_role_key>" \
 *    app node scripts/migrate-from-supabase-admin.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'

function log(section, msg) {
  console.log(`[${section}] ${msg}`)
}

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const targetPool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hidrofitness',
})

async function upsertUserAndProfile(target, user, profileMap) {
  const profile = profileMap.get(user.id) || null
  const email = user.email
  const role = profile?.role || 'user'
  const full_name = profile?.full_name || user.user_metadata?.full_name || null
  const avatar_url = profile?.avatar_url || user.user_metadata?.avatar_url || null
  const updated_at = profile?.updated_at || null

  // Try direct insert by id
  const insertUserSQL = `
    INSERT INTO public.users (id, email, password_hash, full_name, avatar_url, role, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, now())
    ON CONFLICT (id)
    DO UPDATE SET email = EXCLUDED.email,
                  full_name = EXCLUDED.full_name,
                  avatar_url = EXCLUDED.avatar_url,
                  role = EXCLUDED.role
  `
  try {
    await target.query(insertUserSQL, [user.id, email, null, full_name, avatar_url, role])
  } catch (err) {
    // Handle possible unique email conflict
    if (String(err.message).includes('unique') && String(err.message).includes('email')) {
      const { rows } = await target.query('SELECT id FROM public.users WHERE email=$1 LIMIT 1', [email])
      if (rows.length) {
        const localId = rows[0].id
        // Update existing user fields, keep localId
        await target.query(
          'UPDATE public.users SET full_name=$1, avatar_url=$2, role=$3 WHERE id=$4',
          [full_name, avatar_url, role, localId]
        )
        // Adjust profile id to localId
        await target.query(
          `INSERT INTO public.profiles (id, full_name, avatar_url, role, updated_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id)
           DO UPDATE SET full_name = EXCLUDED.full_name,
                         avatar_url = EXCLUDED.avatar_url,
                         role = EXCLUDED.role,
                         updated_at = EXCLUDED.updated_at`,
          [localId, full_name, avatar_url, role, updated_at]
        )
        return
      }
      throw err
    } else {
      throw err
    }
  }

  // Upsert profile using same id
  await target.query(
    `INSERT INTO public.profiles (id, full_name, avatar_url, role, updated_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id)
     DO UPDATE SET full_name = EXCLUDED.full_name,
                   avatar_url = EXCLUDED.avatar_url,
                   role = EXCLUDED.role,
                   updated_at = EXCLUDED.updated_at`,
    [user.id, full_name, avatar_url, role, updated_at]
  )
}

async function migrateUsersAndProfiles() {
  const target = await targetPool.connect()
  try {
    log('users', 'Carregando perfis do Supabase (public.profiles)...')
    let profiles = []
    try {
      let from = 0
      const pageSize = 1000
      while (true) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, updated_at')
          .range(from, from + pageSize - 1)
        if (error) throw error
        if (!data || data.length === 0) break
        profiles.push(...data)
        if (data.length < pageSize) break
        from += pageSize
      }
    } catch (err) {
      console.warn('[users] Não foi possível ler profiles via REST:', err?.message || err)
      console.warn('[users] Prosseguindo sem perfis; vou usar user_metadata dos usuários como fallback')
      profiles = []
    }
    const profileMap = new Map(profiles.map(p => [p.id, p]))

    log('users', 'Lendo usuários via Admin API...')
    let page = 1
    const perPage = 200
    let totalMigrated = 0
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
      if (error) throw error
      const users = data?.users || []
      if (users.length === 0) break
      for (const user of users) {
        await upsertUserAndProfile(target, user, profileMap)
        totalMigrated++
      }
      log('users', `Página ${page} migrada. Total até agora: ${totalMigrated}`)
      page++
    }
    log('users', `Concluído. Total de usuários: ${totalMigrated}`)
  } finally {
    target.release()
  }
}

async function getTableColumns(client, table) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .limit(1)
  if (error) throw error
  if (!data || data.length === 0) {
    // fallback: return empty array
    return []
  }
  return Object.keys(data[0])
}

async function migrateTablePublic(table) {
  const target = await targetPool.connect()
  try {
    const columns = await getTableColumns(target, table)
    log(table, `Lendo dados do Supabase (public.${table}) via REST...`)

    let from = 0
    const pageSize = 1000
    const hasId = columns.includes('id')

    // Build parameterized INSERT once
    const colList = columns.map(c => '"'+c+'"').join(', ')
    const valuePlaceholders = columns.map((_, i) => `$${i + 1}`).join(', ')
    const onConflict = hasId ? ` ON CONFLICT (id) DO NOTHING` : ''
    const insertSQL = `INSERT INTO public."${table}" (${colList}) VALUES (${valuePlaceholders})${onConflict}`

    let total = 0
    while (true) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .range(from, from + pageSize - 1)
      if (error) throw error
      if (!data || data.length === 0) break

      for (const row of data) {
        const values = columns.map(c => row[c])
        await target.query(insertSQL, values)
        total++
      }

      log(table, `Migrados ${total} registros até agora...`)
      if (data.length < pageSize) break
      from += pageSize
    }

    log(table, `Concluído. Total: ${total}`)
  } finally {
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
  log('start', 'Iniciando migração via Admin API + REST')
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

  const summaryTables = ['users','profiles', ...orderedTables]
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