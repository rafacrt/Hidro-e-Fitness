
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Debug em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${pathname}`)
  }

  // DEV_MODE: acesso livre e redireciona para dashboard
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    if (pathname === '/login' || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  const publicRoutes = ['/login', '/register', '/auth/callback', '/forgot-password']
  const token = request.cookies.get('token')?.value

  // sem token e rota não pública
  if (!token && !publicRoutes.includes(pathname)) {
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // com token e rota de login/registro/raiz
  if (token && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // raiz sem token -> login
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
