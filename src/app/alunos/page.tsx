
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
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';

export default async function AlunosPage({
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

  const [students, allStudents, academySettings, userProfile] = await Promise.all([
    getStudents({ query, status }),
    getStudents({ query: '', status: 'all' }),
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
          <StudentStats students={allStudents} />
          <QuickActionsAlunos />

        </main>
      </div>
    </div>
  );
}
