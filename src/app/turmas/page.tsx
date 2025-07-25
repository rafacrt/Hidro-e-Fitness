import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import TurmasStatCards from '@/components/turmas/turmas-stat-cards';
import AulasDeHoje from '@/components/turmas/aulas-de-hoje';
import EstatisticasModalidade from '@/components/turmas/estatisticas-modalidade';
import AcoesRapidasTurmas from '@/components/turmas/acoes-rapidas-turmas';
import TurmasFilters from '@/components/turmas/turmas-filters';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';

export default function TurmasPage() {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Turmas</h1>
              <p className="text-muted-foreground">Gestão completa de turmas e horários</p>
            </div>
            <div className='flex gap-2'>
                <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Turma
                </Button>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Turma
                </Button>
            </div>
          </div>
          
          <TurmasFilters />
          <TurmasStatCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AulasDeHoje />
            </div>
            <div className="lg:col-span-2">
              <EstatisticasModalidade />
            </div>
          </div>

          <AcoesRapidasTurmas />

        </main>
      </div>
    </div>
  );
}
