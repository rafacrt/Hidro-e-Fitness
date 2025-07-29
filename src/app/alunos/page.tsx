
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import StudentsTable from '@/components/alunos/students-table';
import QuickActionsAlunos from '@/components/alunos/quick-actions-alunos';
import StudentStats from '@/components/alunos/student-stats';
import Filters from '@/components/alunos/filters';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddStudentForm } from '@/components/alunos/add-student-form';
import { getStudents } from './actions';
import { unstable_noStore as noStore } from 'next/cache';

export default async function AlunosPage() {
  noStore();
  const students = await getStudents();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Alunos</h1>
              <p className="text-muted-foreground">Gerencie todos os alunos cadastrados</p>
            </div>
            <AddStudentForm>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Aluno
              </Button>
            </AddStudentForm>
          </div>
          
          <Filters />
          <StudentsTable students={students} />
          <StudentStats students={students} />
          <QuickActionsAlunos />

        </main>
      </div>
    </div>
  );
}
