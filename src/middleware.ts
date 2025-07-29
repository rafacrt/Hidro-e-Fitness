import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Debug: Log das requisições em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);
  }

  // Se DEV_MODE estiver ativo, permite todas as rotas sem autenticação
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    console.log('[Middleware] DEV_MODE ativo - permitindo acesso livre');
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Verificar se as variáveis de ambiente do Supabase estão configuradas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('[Middleware] Variáveis do Supabase não configuradas - permitindo acesso livre');
    return NextResponse.next();
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const { pathname } = request.nextUrl
    const publicRoutes = ['/login', '/register', '/auth/callback'];

    // Debug: Log do status da sessão
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] Sessão: ${session ? 'Ativa' : 'Inativa'} | Rota: ${pathname}`);
    }

    // Se não houver sessão e a rota não for pública, redireciona para o login
    if (!session && !publicRoutes.includes(pathname)) {
      console.log(`[Middleware] Redirecionando para /login (sem sessão)`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se houver sessão e o usuário tentar acessar as rotas de login/registro, redireciona para o dashboard
    if (session && (pathname === '/login' || pathname === '/register')) {
      console.log(`[Middleware] Redirecionando para /dashboard (já logado)`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Se não houver sessão e a rota for a raiz, redireciona para o login
    if (!session && pathname === '/') {
      console.log(`[Middleware] Redirecionando raiz para /login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se houver sessão e a rota for a raiz, redireciona para o dashboard
    if (session && pathname === '/') {
      console.log(`[Middleware] Redirecionando raiz para /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  } catch (error) {
    console.error('[Middleware] Erro:', error);
    // Em caso de erro, permite o acesso
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}