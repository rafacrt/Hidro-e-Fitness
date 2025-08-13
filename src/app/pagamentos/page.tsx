
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import PagamentosContent from '@/components/pagamentos/pagamentos-content';
import { getPayments, getPaymentStats, type PaymentStats } from './actions';
import { getAcademySettings, getUserProfile } from '../configuracoes/actions';
import { getStudents } from '../alunos/actions';
import { NavContent } from '@/components/layout/nav-content';
import type { Database } from '@/lib/database.types';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type Payment = Database['public']['Tables']['payments']['Row'];
type Student = Database['public']['Tables']['students']['Row'];
type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];


export default function PagamentosPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || 'all';

  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [stats, setStats] = React.useState<PaymentStats | null>(null);
  const [academySettings, setAcademySettings] = React.useState<AcademySettings | null>(null);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [paymentsData, statsData, settingsData, profileData, studentsData] = await Promise.all([
        getPayments({ query, status }),
        getPaymentStats(),
        getAcademySettings(),
        getUserProfile(),
        getStudents(),
      ]);
      setPayments(paymentsData);
      setStats(statsData);
      setAcademySettings(settingsData);
      setUserProfile(profileData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Failed to load payments data", error);
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);


  if (loading) {
    return (
       <div className="flex min-h-screen w-full bg-background text-foreground">
           <Sidebar>
               <NavContent settings={academySettings} />
           </Sidebar>
           <div className="flex flex-col w-0 flex-1">
               <Header settings={academySettings} userProfile={userProfile} />
               <main className="flex-1 flex items-center justify-center">
                   <Loader2 className="h-8 w-8 animate-spin" />
               </main>
           </div>
       </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar>
        <NavContent settings={academySettings} />
      </Sidebar>
      <div className="flex flex-col w-0 flex-1">
        <Header settings={academySettings} userProfile={userProfile} />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {stats && <PagamentosContent payments={payments} stats={stats} students={students} onSuccess={loadData} />}
        </main>
      </div>
    </div>
  );
}
