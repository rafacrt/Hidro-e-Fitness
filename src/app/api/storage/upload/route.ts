import { NextResponse, NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { getServerUser } from '@/lib/auth/session'

export const runtime = 'nodejs'

function ensureExt(filename: string, mime: string): string {
  const ext = path.extname(filename)
  if (ext) return filename
  const map: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
  }
  const resolved = map[mime] || ''
  return filename + resolved
}

export async function POST(req: NextRequest) {
  const user = getServerUser()
  if (!user?.id) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
  }

  const searchParams = new URL(req.url).searchParams
  const type = searchParams.get('type') || 'file'
  const subdir = type === 'avatar' ? 'avatars' : type === 'logo' ? 'logos' : 'uploads'

  const formData = await req.formData()
  const file = (formData.get('avatar') || formData.get('logo') || formData.get('file') || formData.get('image')) as File | null

  if (!file || file.size === 0) {
    return NextResponse.json({ message: 'Nenhum arquivo enviado.' }, { status: 400 })
  }

  try {
    const baseDir = process.env.FILE_STORAGE_DIR || path.join(process.cwd(), 'storage')
    const userDir = path.join(baseDir, subdir, user.id)
    await fs.mkdir(userDir, { recursive: true })

    const filenameBase = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const safeName = ensureExt(filenameBase, file.type)
    const filepath = path.join(userDir, safeName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filepath, buffer)

    const publicUrl = `/api/storage/${subdir}/${user.id}/${safeName}`
    return NextResponse.json({ url: publicUrl }, { status: 200 })
  } catch (err: any) {
    console.error('Erro no upload local:', err)
    return NextResponse.json({ message: 'Erro no upload.' }, { status: 500 })
  }
}