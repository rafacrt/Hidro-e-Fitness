
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';

type Report = Database['public']['Tables']['reports']['Row'];

export interface ReportStats {
  generatedReports: number;
  totalRevenue: number;
  activeStudents: number;
  attendanceRate: number;
}

export async function getReportStats(): Promise<ReportStats> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { count: generatedReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount, type')
      .eq('status', 'pago');
    
    if (paymentsError) throw paymentsError;

    const totalRevenue = payments
      .filter(p => p.type === 'receita')
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    const { count: activeStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo');
    
    // Placeholder for attendance rate as it's not implemented yet
    const attendanceRate = 87.5;

    return {
      generatedReports: generatedReports || 0,
      totalRevenue: totalRevenue,
      activeStudents: activeStudents || 0,
      attendanceRate: attendanceRate,
    };
  } catch (error) {
    console.error('Error fetching report stats:', error);
    return {
      generatedReports: 0,
      totalRevenue: 0,
      activeStudents: 0,
      attendanceRate: 0,
    };
  }
}

export async function getMostUsedReports(): Promise<Report[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('times_generated', { ascending: false })
      .limit(4);

    if (error) {
      // It's possible the table doesn't exist, so we'll just return an empty array
      return [];
    }

    return data;
  } catch (error) {
    // Also catch unexpected errors and return empty
    return [];
  }
}

// Mocking recent activities for now
export async function getRecentActivities() {
    return [
        { 
          title: 'Relatório Financeiro gerado', 
          author: 'Admin Sistema', 
          time: '2 horas atrás', 
          icon: 'File',
        },
        { 
          title: 'Relatório de Frequência exportado', 
          author: 'Prof. Ana Silva', 
          time: '4 horas atrás', 
          icon: 'Download',
        },
        { 
          title: 'Relatório Personalizado criado', 
          author: 'Admin Sistema', 
          time: '1 dia atrás', 
          icon: 'BarChart2',
        },
        { 
          title: 'Relatório de Alunos compartilhado', 
          author: 'Recepção', 
          time: '2 dias atrás', 
          icon: 'Eye',
        },
      ];
}
