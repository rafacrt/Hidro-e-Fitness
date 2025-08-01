
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Debug: Log das requisições em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${pathname}`);
  }

  // Se DEV_MODE estiver ativo, redireciona para o dashboard se estiver na raiz ou no login
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] DEV_MODE ativo - permitindo acesso livre');
    }
    if (pathname === '/login' || pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Verificar se as variáveis de ambiente do Supabase estão configuradas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('[Middleware] Variáveis do Supabase não configuradas');
    
    // Em desenvolvimento, permite acesso
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    
    // Em produção, redireciona para erro
    return NextResponse.redirect(new URL('/login?error=config', request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
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

    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[Middleware] Erro ao obter sessão:', error);
    }

    const publicRoutes = ['/login', '/register', '/auth/callback'];

    // Debug: Log do status da sessão
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] Sessão: ${session ? 'Ativa' : 'Inativa'} | Rota: ${pathname}`);
    }

    // Se não houver sessão e a rota não for pública, redireciona para o login
    if (!session && !publicRoutes.includes(pathname)) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Middleware] Redirecionando para /login (sem sessão)`);
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se houver sessão e o usuário tentar acessar as rotas de login/registro, redireciona para o dashboard
    if (session && (pathname === '/login' || pathname === '/register')) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Middleware] Redirecionando para /dashboard (já logado)`);
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Se não houver sessão e a rota for a raiz, redireciona para o login
    if (!session && pathname === '/') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Middleware] Redirecionando raiz para /login`);
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se houver sessão e a rota for a raiz, redireciona para o dashboard
    if (session && pathname === '/') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Middleware] Redirecionando raiz para /dashboard`);
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  } catch (error) {
    console.error('[Middleware] Erro:', error);
    
    // Em caso de erro em desenvolvimento, permite o acesso
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    
    // Em produção, redireciona para login
    return NextResponse.redirect(new URL('/login?error=middleware', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
