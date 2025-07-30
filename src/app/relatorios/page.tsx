import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import RelatoriosFilters from '@/components/relatorios/relatorios-filters';
import RelatoriosStats from '@/components/relatorios/relatorios-stats';
import RelatoriosMaisUtilizados from '@/components/relatorios/relatorios-mais-utilizados';
import AtividadeRecente from '@/components/relatorios/atividade-recente';
import AcoesRapidasRelatorios from '@/components/relatorios/acoes-rapidas-relatorios';
import ResumoPerformance from '@/components/relatorios/resumo-performance';
import { getMostUsedReports, getRecentActivities, getReportStats } from './actions';
import { unstable_noStore as noStore } from 'next/cache';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';

export default async function RelatoriosPage() {
  noStore();
  const [stats, mostUsedReports, recentActivities, academySettings, userProfile] = await Promise.all([
    getReportStats(),
    getMostUsedReports(),
    getRecentActivities(),
    getAcademySettings(),
    getUserProfile()
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Relatórios</h1>
              <p className="text-muted-foreground">Análises e relatórios completos da academia</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros Avançados
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>
          
          <RelatoriosFilters />
          <RelatoriosStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RelatoriosMaisUtilizados reports={mostUsedReports} />
            <AtividadeRecente activities={recentActivities} />
          </div>

          <AcoesRapidasRelatorios />
          <ResumoPerformance />

        </main>
      </div>
    </div>
  );
}
