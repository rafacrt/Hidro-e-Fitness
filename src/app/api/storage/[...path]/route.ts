import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

function contentTypeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    case '.gif': return 'image/gif'
    case '.pdf': return 'application/pdf'
    default: return 'application/octet-stream'
  }
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  const segments = ctx.params.path
  if (!segments || segments.length === 0) {
    return new NextResponse('Not Found', { status: 404 })
  }
  try {
    const baseDir = process.env.FILE_STORAGE_DIR || path.join(process.cwd(), 'storage')
    const filepath = path.join(baseDir, ...segments)
    const stat = await fs.stat(filepath).catch(() => null)
    if (!stat || !stat.isFile()) {
      return new NextResponse('Not Found', { status: 404 })
    }
    const ext = path.extname(filepath)
    const mime = contentTypeFromExt(ext)
    const data = await fs.readFile(filepath)
    return new NextResponse(data, {
      status: 200,
      headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=31536000, immutable' }
    })
  } catch (err) {
    console.error('Erro ao servir arquivo:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}