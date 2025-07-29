import LoginForm from '@/components/auth/login-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    redirect('/dashboard');
  }
  
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <LoginForm />
    </main>
  );
}
