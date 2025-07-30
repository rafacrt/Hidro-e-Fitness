
import { unstable_noStore as noStore } from 'next/cache';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import PagamentosContent from '@/components/pagamentos/pagamentos-content';
import { getPayments, getPaymentStats } from './actions';
import { getAcademySettings } from '../configuracoes/actions';

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

  const payments = await getPayments({ query, status });
  const stats = await getPaymentStats();
  const academySettings = await getAcademySettings();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} />
        <main className="flex-1 p-6 space-y-6">
          <PagamentosContent payments={payments} stats={stats} />
        </main>
      </div>
    </div>
  );
}
