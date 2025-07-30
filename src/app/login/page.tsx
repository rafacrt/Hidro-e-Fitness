import LoginForm from '@/components/auth/login-form';
import { getAcademySettings } from '../configuracoes/actions';
import { unstable_noStore as noStore } from 'next/cache';

export default async function LoginPage() {
  noStore();
  const academySettings = await getAcademySettings();

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <LoginForm settings={academySettings} />
    </main>
  );
}
