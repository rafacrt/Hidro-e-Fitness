
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'] & { students: Pick<Database['public']['Tables']['students']['Row'], 'name'> | null };

export interface DashboardStats {
  activeStudents: number;
  classesToday: number;
  monthlyRevenue: number;
  attendanceRate: number; // Manter mockado por enquanto
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createSupabaseServerClient();
    const today = new Date();
    const startOfCurrentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);

    // Alunos Ativos
    const { count: activeStudents, error: studentsError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo');

    if (studentsError) throw studentsError;

    // Receita Mensal
    const { data: monthlyPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('type', 'receita')
      .eq('status', 'pago')
      .gte('paid_at', startOfCurrentMonth.toISOString())
      .lte('paid_at', endOfCurrentMonth.toISOString());

    if (paymentsError) throw paymentsError;
    const monthlyRevenue = monthlyPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

    // Turmas Hoje (Lógica simplificada, verifica se o dia da semana corresponde)
    const dayOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayOfWeek = dayOfWeekMap[today.getDay()];
    
    const { count: classesToday, error: classesError } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativa')
        .contains('days_of_week', [currentDayOfWeek]);

    if (classesError) throw classesError;

    return {
      activeStudents: activeStudents || 0,
      classesToday: classesToday || 0,
      monthlyRevenue: monthlyRevenue,
      attendanceRate: 87, // Frequência mockada por enquanto
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
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
        .limit(3);

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

export async function getRecentPayments(): Promise<Payment[]> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('payments')
            .select(`
                *,
                students ( name )
            `)
            .eq('type', 'receita')
            .order('paid_at', { ascending: false })
            .limit(3);

        if (error) {
            console.error('Error fetching recent payments:', error);
            throw new Error('Não foi possível buscar os pagamentos recentes.');
        }
        
        return data;
    } catch(error) {
        console.error('Unexpected error fetching recent payments:', error);
        return [];
    }
}
