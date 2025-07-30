import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import ProfileSettings from '@/components/configuracoes/profile-settings';
import AcademySettings from '@/components/configuracoes/academy-settings';
import UserManagement from '@/components/configuracoes/user-management';
import { getAcademySettings, getUserProfile } from './actions';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ConfiguracoesPage() {
  noStore();
  const [academySettings, userProfile] = await Promise.all([
    getAcademySettings(),
    getUserProfile()
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Gerencie as configurações do seu perfil e da academia.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ProfileSettings userProfile={userProfile} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <AcademySettings settings={academySettings} />
              <UserManagement />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
