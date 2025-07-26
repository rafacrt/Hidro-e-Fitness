import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import TurmasFilters from '@/components/turmas/turmas-filters';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import RelatoriosTurmasCards from '@/components/turmas/relatorios-turmas-cards';
import FiltrosRelatorioTurmas from '@/components/turmas/filtros-relatorio-turmas';
import { Card, CardContent } from '@/components/ui/card';
import OcupacaoModalidade from '@/components/turmas/ocupacao-modalidade';
import OcupacaoHorario from '@/components/turmas/ocupacao-horario';

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
          <RelatoriosTurmasCards />
          <FiltrosRelatorioTurmas />

          <Card>
            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OcupacaoModalidade />
              <OcupacaoHorario />
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  );
}
