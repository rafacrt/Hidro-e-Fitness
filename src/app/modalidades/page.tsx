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
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';

export default async function ModalidadesPage() {
  noStore();
  const [modalities, academySettings, userProfile] = await Promise.all([
    getModalities(),
    getAcademySettings(),
    getUserProfile()
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Modalidades</h1>
              <p className="text-muted-foreground">Gestão completa de modalidades e atividades</p>
            </div>
            <div className='flex gap-2 w-full md:w-auto'>
                <Button variant="outline" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                </Button>
                <AddModalityForm>
                    <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova
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
