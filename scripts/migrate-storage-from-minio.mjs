#!/usr/bin/env node
/**
 * Migra arquivos de buckets MinIO (Supabase Storage) para o storage local (/app/storage).
 * Requer:
 *  - MINIO_ENDPOINT (ex.: http://supabase.app.rajo.com.br)
 *  - MINIO_PORT (ex.: 9000)
 *  - MINIO_SSL (true/false)
 *  - MINIO_ACCESS_KEY
 *  - MINIO_SECRET_KEY
 *
 * Uso:
 *  docker compose exec \
 *    -e MINIO_ENDPOINT="http://supabase.app.rajo.com.br" \
 *    -e MINIO_PORT="9000" \
 *    -e MINIO_SSL="false" \
 *    -e MINIO_ACCESS_KEY="<access>" \
 *    -e MINIO_SECRET_KEY="<secret>" \
 *    app node scripts/migrate-storage-from-minio.mjs
 */
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from 'node:fs'
import path from 'node:path'

function log(section, msg) {
  console.log(`[${section}] ${msg}`)
}

const endpoint = process.env.MINIO_ENDPOINT
const port = process.env.MINIO_PORT || '9000'
const useSSL = (process.env.MINIO_SSL || 'false').toLowerCase() === 'true'
const accessKeyId = process.env.MINIO_ACCESS_KEY
const secretAccessKey = process.env.MINIO_SECRET_KEY

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.error('ERROR: Defina MINIO_ENDPOINT, MINIO_ACCESS_KEY e MINIO_SECRET_KEY.')
  process.exit(1)
}

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: `${endpoint}:${port}`,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
})

const buckets = ['avatars', 'logos']
const baseDir = '/app/storage'

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true })
}

async function downloadObject(bucket, key) {
  const outDir = path.join(baseDir, bucket)
  await ensureDir(outDir)
  const outPath = path.join(outDir, key)
  // garantir subpastas se o key contiver '/'
  await ensureDir(path.dirname(outPath))

  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  const body = res.Body
  if (!body) return
  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outPath)
    body.pipe(writeStream)
    writeStream.on('finish', resolve)
    writeStream.on('error', reject)
  })
}

async function migrateBucket(bucket) {
  log(bucket, 'Listando objetos...')
  let continuationToken
  let count = 0

  while (true) {
    const cmd = new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: continuationToken })
    const res = await s3.send(cmd)
    const contents = res.Contents || []

    for (const obj of contents) {
      const key = obj.Key
      if (!key) continue
      await downloadObject(bucket, key)
      count++
      if (count % 50 === 0) log(bucket, `Baixados ${count} arquivos...`)
    }

    if (res.IsTruncated) {
      continuationToken = res.NextContinuationToken
    } else {
      break
    }
  }

  log(bucket, `Concluído. Total: ${count}`)
}

async function main() {
  log('start', 'Iniciando migração de Storage MinIO → /app/storage')
  for (const b of buckets) {
    try {
      await migrateBucket(b)
    } catch (err) {
      console.error(`[${b}] erro:`, err)
    }
  }
  log('done', 'Migração de storage concluída.')
}

main().catch(err => {
  console.error('Migration error:', err)
  process.exit(1)
})