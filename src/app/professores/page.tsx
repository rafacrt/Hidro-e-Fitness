import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ProfessoresTable from '@/components/professores/professores-table';
import ProfessoresStats from '@/components/professores/professores-stats';
import ProfessoresFilters from '@/components/professores/professores-filters';
import { AddProfessorForm } from '@/components/professores/add-professor-form';
import { getInstructors } from './actions';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ProfessoresPage() {
  noStore();
  const instructors = await getInstructors();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Professores</h1>
              <p className="text-muted-foreground">Gerencie todos os professores da academia</p>
            </div>
            <AddProfessorForm>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Professor
              </Button>
            </AddProfessorForm>
          </div>

          <ProfessoresStats instructors={instructors} />
          <ProfessoresFilters />
          <ProfessoresTable instructors={instructors} />

        </main>
      </div>
    </div>
  );
}
