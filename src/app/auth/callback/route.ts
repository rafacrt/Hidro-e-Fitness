import { NextRequest, NextResponse } from 'next/server'

// Callback sem Supabase: redireciona de forma segura usando o parâmetro "next"
// e/ou presença do cookie "token" (JWT) emitido pelo nosso backend.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next')
  const hasToken = !!request.cookies.get('token')?.value

  // Se houver destino explícito, respeita o parâmetro
  if (next) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  // Sem "next": encaminha para dashboard se autenticado, senão para login
  return NextResponse.redirect(`${origin}${hasToken ? '/dashboard' : '/login'}`)
}
