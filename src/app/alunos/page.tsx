
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
import type { Database } from '@/lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];

function filterStudents(students: Student[], query: string, status: string): Student[] {
  return students.filter(student => {
    const statusMatch = status === 'all' || student.status === status;
    const queryMatch =
      !query ||
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(query.toLowerCase())) ||
      (student.cpf && student.cpf.includes(query));
    return statusMatch && queryMatch;
  });
}

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

  const [allStudents, academySettings, userProfile] = await Promise.all([
    getStudents(),
    getAcademySettings(),
    getUserProfile()
  ]);

  const filteredStudents = filterStudents(allStudents, query, status);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar settings={academySettings} />
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
          <StudentsTable students={filteredStudents} />
          <StudentStats students={allStudents} />
          <QuickActionsAlunos />

        </main>
      </div>
    </div>
  );
}
