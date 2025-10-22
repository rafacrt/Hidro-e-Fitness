#!/usr/bin/env node
/**
 * Migra arquivos dos buckets do Supabase Storage via API (sem acessar MinIO diretamente).
 *
 * Requer:
 *  - SUPABASE_URL (Project URL do Supabase)
 *  - SUPABASE_SERVICE_ROLE_KEY (Service Role Key)
 *  - FILE_STORAGE_DIR (/app/storage, já definido no container)
 *
 * Uso:
 *  docker compose exec \
 *    -e SUPABASE_URL="https://supabase.app.rajo.com.br" \
 *    -e SUPABASE_SERVICE_ROLE_KEY="<service_role_key>" \
 *    app node scripts/migrate-storage-from-supabase-storage.mjs
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OUTPUT_DIR = process.env.FILE_STORAGE_DIR || '/app/storage'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function log(section, msg) {
  console.log(`[${section}] ${msg}`)
}

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true })
}

async function listAll(bucket, prefix = '') {
  let from = 0
  const pageSize = 1000
  const files = []
  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: pageSize,
      offset: from,
      search: '',
    })
    if (error) throw error
    if (!data || data.length === 0) break
    for (const item of data) {
      if (item.name) {
        files.push({ bucket, path: prefix ? `${prefix}/${item.name}` : item.name, item })
      }
      // If it's a folder, recursively list
      if (item.id === null && item.name && item.created_at === null) {
        // Heurística: pastas no Supabase Storage vêm como objetos sem id/criação
        const subFiles = await listAll(bucket, prefix ? `${prefix}/${item.name}` : item.name)
        files.push(...subFiles)
      }
    }
    if (data.length < pageSize) break
    from += pageSize
  }
  return files
}

async function downloadObject(bucket, objectPath, destPath) {
  const { data, error } = await supabase.storage.from(bucket).download(objectPath)
  if (error) throw error
  const arrayBuffer = await data.arrayBuffer()
  const buf = Buffer.from(arrayBuffer)
  await ensureDir(path.dirname(destPath))
  await fs.promises.writeFile(destPath, buf)
}

async function migrateBucket(bucket) {
  log(bucket, 'Listando objetos...')
  const objects = await listAll(bucket)
  log(bucket, `Total objetos: ${objects.length}`)
  let ok = 0
  let fail = 0
  for (const obj of objects) {
    const dest = path.join(OUTPUT_DIR, bucket, obj.path)
    try {
      await downloadObject(bucket, obj.path, dest)
      ok++
      if (ok % 50 === 0) log(bucket, `Baixados ${ok} objetos...`)
    } catch (err) {
      fail++
      console.error(`[${bucket}] Falha ao baixar ${obj.path}:`, err?.message || err)
    }
  }
  log(bucket, `Concluído: ${ok} ok, ${fail} falhas.`)
}

async function main() {
  const buckets = ['avatars', 'logos']
  for (const b of buckets) {
    await migrateBucket(b)
  }
  log('done', 'Migração de storage via API concluída.')
}

main().catch(err => {
  console.error('Migration error:', err)
  process.exit(1)
})