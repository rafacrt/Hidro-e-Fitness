
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import PagamentosContent from '@/components/pagamentos/pagamentos-content';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { getStudents } from '../alunos/actions';
import { getTransactions } from '../financeiro/actions';
import { getPaymentStats } from './actions';
import { NavContent } from '@/components/layout/nav-content';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Student = Database['public']['Tables']['students']['Row'];

export default function PagamentosPage() {
  const [settings, setSettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [stats, setStats] = React.useState<any>(null); // Replace 'any' with a proper type
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [
        settingsData,
        profileData,
        paymentsData,
        studentsData,
        statsData
      ] = await Promise.all([
        getAcademySettings(),
        getUserProfile(),
        getTransactions('all'),
        getStudents(),
        getPaymentStats()
      ]);
      setSettings(settingsData);
      setUserProfile(profileData);
      setPayments(paymentsData);
      setStudents(studentsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load payments data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar>
          <NavContent settings={settings} />
        </Sidebar>
        <div className="flex flex-col w-0 flex-1">
          <Header settings={settings} userProfile={userProfile} />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </main>
        </div>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar>
        <NavContent settings={settings} />
      </Sidebar>
      <div className="flex flex-col w-0 flex-1">
        <Header settings={settings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <PagamentosContent 
            payments={payments}
            stats={stats}
            students={students}
            onSuccess={loadData}
          />
        </main>
      </div>
    </div>
  );
}
