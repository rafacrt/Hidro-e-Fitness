
import { unstable_noStore as noStore } from 'next/cache';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import PagamentosContent from '@/components/pagamentos/pagamentos-content';
import { getPayments, getPaymentStats } from './actions';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { getStudents } from '../alunos/actions';

export default async function PagamentosPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    status?: string;
  };
}) {
  noStore();
  const query = searchParams?.query || '';
  const status = searchParams?.status || 'all';

  const [payments, stats, academySettings, userProfile, students] = await Promise.all([
    getPayments({ query, status }),
    getPaymentStats(),
    getAcademySettings(),
    getUserProfile(),
    getStudents(),
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <PagamentosContent payments={payments} stats={stats} students={students} />
        </main>
      </div>
    </div>
  );
}
