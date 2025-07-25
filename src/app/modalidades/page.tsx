import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import ModalitiesStatCards from '@/components/modalidades/modalities-stat-cards';
import ModalitiesFilters from '@/components/modalidades/modalities-filters';
import ModalityTypes from '@/components/modalidades/modality-types';
import PopularModalities from '@/components/modalidades/popular-modalities';
import AllModalities from '@/components/modalidades/all-modalities';
import QuickActionsModalities from '@/components/modalidades/quick-actions-modalities';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';

export default function ModalidadesPage() {
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
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Modalidade
                </Button>
            </div>
          </div>
          
          <ModalitiesFilters />
          <ModalitiesStatCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ModalityTypes />
              <PopularModalities />
            </div>
            <div className="lg:col-span-2">
              <AllModalities />
            </div>
          </div>

          <QuickActionsModalities />

        </main>
      </div>
    </div>
  );
}
