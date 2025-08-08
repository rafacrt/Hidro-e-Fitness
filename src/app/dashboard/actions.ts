
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];

export interface DashboardStats {
  activeStudents: number;
  classesToday: number;
  monthlyRevenue: number;
  attendanceRate: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();
  const today = new Date();

  try {
    // Alunos Ativos
    const { count: activeStudents, error: studentsError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo');
    if (studentsError) throw new Error(`Error fetching active students: ${studentsError.message}`);

    // Turmas Hoje
    const dayOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayOfWeek = dayOfWeekMap[today.getDay()];
    const { count: classesToday, error: classesError } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativa')
      .contains('days_of_week', [currentDayOfWeek]);
    if (classesError) throw new Error(`Error fetching classes today: ${classesError.message}`);

    // Receita Mensal
    const startOfCurrentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);
    const { data: revenueData, error: revenueError } = await supabase
      .from('payments')
      .select('amount')
      .gt('amount', 0) // Considerar apenas entradas (valores positivos) como receita
      .eq('status', 'pago')
      .gte('created_at', startOfCurrentMonth.toISOString())
      .lte('created_at', endOfCurrentMonth.toISOString());
    if (revenueError) throw new Error(`Error fetching monthly revenue: ${revenueError.message}`);
    
    const monthlyRevenue = revenueData ? revenueData.reduce((sum, payment) => sum + (payment.amount || 0), 0) : 0;
    
    // Taxa de Presença (Mês Corrente)
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('status')
      .gte('created_at', startOfCurrentMonth.toISOString())
      .lte('created_at', endOfCurrentMonth.toISOString());
      
    if (attendanceError) throw new Error(`Error fetching attendance data: ${attendanceError.message}`);

    let attendanceRate = 0;
    if (attendanceData && attendanceData.length > 0) {
        const presentCount = attendanceData.filter(a => a.status === 'presente').length;
        const totalCount = attendanceData.length;
        attendanceRate = (presentCount / totalCount) * 100;
    }


    return {
      activeStudents: activeStudents || 0,
      classesToday: classesToday || 0,
      monthlyRevenue: monthlyRevenue,
      attendanceRate: attendanceRate,
    };
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error.message);
    return {
      activeStudents: 0,
      classesToday: 0,
      monthlyRevenue: 0,
      attendanceRate: 0,
    };
  }
}

export async function getUpcomingClasses(): Promise<(ClassRow & { instructors: Pick<Instructor, 'name'> | null })[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const today = new Date();
    const dayOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayOfWeek = dayOfWeekMap[today.getDay()];
    
    const { data, error } = await supabase
        .from('classes')
        .select(`
            *,
            instructors ( name )
        `)
        .eq('status', 'ativa')
        .contains('days_of_week', [currentDayOfWeek])
        .order('start_time', { ascending: true })
        .limit(5);

    if (error) {
        console.error('Error fetching upcoming classes:', error);
        throw new Error('Não foi possível buscar as próximas turmas.');
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching upcoming classes:', error);
    return [];
  }
}
