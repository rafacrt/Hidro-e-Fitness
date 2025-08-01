
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
  attendanceRate: number; // Manter mockado por enquanto
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createSupabaseServerClient();
    const today = new Date();
    
    // Alunos Ativos
    const { count: activeStudents, error: studentsError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo');

    if (studentsError) throw studentsError;

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
      monthlyRevenue: 0, // Mockado pois a tabela payments não existe
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
