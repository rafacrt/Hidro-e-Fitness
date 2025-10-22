import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { signUserJWT } from '@/lib/auth/jwt'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hidrofitness',
})

export async function POST(req: NextRequest) {
  try {
    let email = ''
    let password = ''

    const body = await req.json().catch(() => ({} as any))
    email = body?.email || ''
    password = body?.password || ''

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const { rows } = await client.query(
        'SELECT id, email, password_hash, role FROM public.users WHERE email=$1 LIMIT 1',
        [email]
      )

      if (rows.length === 0) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 401 })
      }

      const user = rows[0]

      // Conta migrada sem senha definida ainda
      if (!user.password_hash) {
        return NextResponse.json(
          { error: 'Conta migrada sem senha. Solicite redefinição de senha.' },
          { status: 403 }
        )
      }

      const ok = await bcrypt.compare(password, user.password_hash)
      if (!ok) {
        return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 })
      }

      const token = signUserJWT({ id: user.id, role: user.role || 'user', email: user.email })

      // Define cookie httpOnly
      const res = NextResponse.json({ success: true })
      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12, // 12h
      })
      return res
    } finally {
      client.release()
    }
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}