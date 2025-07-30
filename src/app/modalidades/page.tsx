import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import ModalitiesStatCards from '@/components/modalidades/modalities-stat-cards';
import ModalitiesFilters from '@/components/modalidades/modalities-filters';
import ModalitiesTable from '@/components/modalidades/modalities-table';
import QuickActionsModalities from '@/components/modalidades/quick-actions-modalities';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import TableFilters from '@/components/modalidades/table-filters';
import { getModalities } from './actions';
import { AddModalityForm } from '@/components/modalidades/add-modality-form';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ModalidadesPage() {
  noStore();
  const modalities = await getModalities();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Modalidades</h1>
              <p className="text-muted-foreground">Gestão completa de modalidades e atividades</p>
            </div>
            <div className='flex gap-2'>
                <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Modalidade
                </Button>
                <AddModalityForm>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Modalidade
                    </Button>
                </AddModalityForm>
            </div>
          </div>
          
          <ModalitiesFilters />
          <ModalitiesStatCards />
          <TableFilters />
          <ModalitiesTable modalities={modalities} />
          <QuickActionsModalities />

        </main>
      </div>
    </div>
  );
}
