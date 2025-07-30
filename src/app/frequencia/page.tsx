import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import FrequenciaFilters from '@/components/frequencia/frequencia-filters';
import FrequenciaStatsCards from '@/components/frequencia/frequencia-stats-cards';
import FrequenciaPorModalidade from '@/components/frequencia/frequencia-por-modalidade';
import AulasDeHojeFrequencia from '@/components/frequencia/aulas-de-hoje-frequencia';
import AlunosBaixaFrequencia from '@/components/frequencia/alunos-baixa-frequencia';
import AcoesRapidasFrequencia from '@/components/frequencia/acoes-rapidas-frequencia';
import { getAcademySettings } from '../configuracoes/actions';
import { unstable_noStore as noStore } from 'next/cache';

export default async function FrequenciaPage() {
  noStore();
  const academySettings = await getAcademySettings();
  
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Frequência</h1>
              <p className="text-muted-foreground">Controle completo de presença e assiduidade</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Marcar Presença
              </Button>
            </div>
          </div>
          
          <FrequenciaFilters />
          <FrequenciaStatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FrequenciaPorModalidade />
            <AulasDeHojeFrequencia />
          </div>

          <AlunosBaixaFrequencia />
          <AcoesRapidasFrequencia />

        </main>
      </div>
    </div>
  );
}
