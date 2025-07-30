import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import { getAcademySettings } from '@/app/configuracoes/actions';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ForgotPasswordPage() {
  noStore();
  const academySettings = await getAcademySettings();

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <ForgotPasswordForm settings={academySettings} />
    </main>
  );
}
