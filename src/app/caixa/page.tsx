
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { NavContent } from '@/components/layout/nav-content';
import type { Database } from '@/lib/database.types';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { Loader2 } from 'lucide-react';
import CaixaInterface from '@/components/caixa/caixa-interface';
import { getStudents } from '../alunos/actions';
import { getPendingPayments } from '../financeiro/actions';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Student = Database['public']['Tables']['students']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

export default function CaixaPage() {
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadInitialData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [settingsData, profileData, studentsData] = await Promise.all([
        getAcademySettings(),
        getUserProfile(),
        getStudents(),
      ]);
      setSettings(settingsData);
      setUserProfile(profileData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Failed to load data for Caixa page", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const fetchStudentDebts = async (studentId: string): Promise<Payment[]> => {
    try {
        return await getPendingPayments(studentId);
    } catch (error) {
        console.error("Failed to fetch student debts", error);
        return [];
    }
  };


  return (
    <div className="flex min-h-screen w-full bg-secondary/50 text-foreground">
      <Sidebar>
        <NavContent settings={settings} />
      </Sidebar>
      <div className="flex flex-col w-0 flex-1">
        <Header settings={settings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CaixaInterface 
              students={students}
              fetchStudentDebts={fetchStudentDebts}
              onSuccess={loadInitialData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
