
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import StudentsTable from '@/components/alunos/students-table';
import QuickActionsAlunos from '@/components/alunos/quick-actions-alunos';
import StudentStats from '@/components/alunos/student-stats';
import Filters, { type ActiveTabAlunos } from '@/components/alunos/filters';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { AddStudentForm } from '@/components/alunos/add-student-form';
import { getStudents } from './actions';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import type { Database } from '@/lib/database.types';
import { mockStudents } from '@/lib/mock-data';
import { NavContent } from '@/components/layout/nav-content';
import { useSearchParams, useRouter } from 'next/navigation';
import ControlePagamentosTab from '@/components/alunos/controle-pagamentos-tab';

type Student = Database['public']['Tables']['students']['Row'];
type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

function processStudents(
  students: Student[],
  query: string,
  status: string,
  sort: string | undefined,
  order: string | undefined
): Student[] {
  // 1. Filtering
  let filteredStudents = students.filter(student => {
    const statusMatch = status === 'all' || student.status === status;
    const queryMatch =
      !query ||
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(query.toLowerCase())) ||
      (student.cpf && student.cpf.includes(query));
    return statusMatch && queryMatch;
  });

  // 2. Sorting
  if (sort) {
    filteredStudents.sort((a, b) => {
      let valA: any = a[sort as keyof Student] || '';
      let valB: any = b[sort as keyof Student] || '';

      if (sort === 'birth_date' || sort === 'created_at') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filteredStudents;
}

export default function AlunosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [allStudents, setAllStudents] = React.useState<Student[]>([]);
  const [processedStudents, setProcessedStudents] = React.useState<Student[]>([]);
  const [academySettings, setAcademySettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);

  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const activeTab = (searchParams.get('tab') || 'Visão Geral') as ActiveTabAlunos;

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [dbStudents, settings, profile] = await Promise.all([
        getStudents(),
        getAcademySettings(),
        getUserProfile()
      ]);

      const studentsData = (process.env.NODE_ENV === 'development' && dbStudents.length === 0)
        ? mockStudents
        : dbStudents;
      
      setAllStudents(studentsData);
      setAcademySettings(settings);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  
  React.useEffect(() => {
    const processed = processStudents(allStudents, query, status, sort, order);
    setProcessedStudents(processed);
  }, [allStudents, query, status, sort, order]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    switch(activeTab) {
      case 'Visão Geral':
        return (
          <div className="space-y-6">
            <StudentsTable students={processedStudents} />
            <StudentStats students={allStudents} />
            <QuickActionsAlunos onSuccess={() => router.refresh()} />
          </div>
        );
      case 'Controle de Pagamentos':
        return <ControlePagamentosTab />;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar>
        <NavContent settings={academySettings} />
      </Sidebar>
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Alunos</h1>
              <p className="text-muted-foreground">Gerencie todos os alunos cadastrados e seus pagamentos</p>
            </div>
            <AddStudentForm onSuccess={() => router.refresh()}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Aluno
              </Button>
            </AddStudentForm>
          </div>
          
          <Filters />
          
          {renderContent()}

        </main>
      </div>
    </div>
  );
}
