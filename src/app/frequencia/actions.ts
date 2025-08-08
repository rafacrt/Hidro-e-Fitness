
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';
import { startOfDay, endOfDay } from 'date-fns';

type Attendance = Database['public']['Tables']['attendance']['Row'];

export interface AttendanceStats {
  generalRate: number;
  presentToday: number;
  totalScheduledToday: number;
  absentToday: number;
  classesToday: number;
}

export async function getAttendanceStats(): Promise<AttendanceStats> {
  const supabase = await createSupabaseServerClient();
  const today = new Date();
  
  try {
    const { data: monthlyAttendance, error: monthlyError } = await supabase
      .from('attendance')
      .select('status');
      
    if (monthlyError) throw new Error(`Error fetching monthly attendance: ${monthlyError.message}`);

    const generalRate = monthlyAttendance.length > 0
      ? (monthlyAttendance.filter(a => a.status === 'presente').length / monthlyAttendance.length) * 100
      : 0;

    const { data: todayAttendance, error: todayError } = await supabase
      .from('attendance')
      .select('status')
      .gte('date', startOfDay(today).toISOString())
      .lte('date', endOfDay(today).toISOString());

    if (todayError) throw new Error(`Error fetching today's attendance: ${todayError.message}`);

    const presentToday = todayAttendance.filter(a => a.status === 'presente').length;
    const absentToday = todayAttendance.filter(a => a.status === 'ausente').length;

    // This is a simplification. A real scenario would need to count unique students scheduled for today.
    const totalScheduledToday = todayAttendance.length; 
    
    // Simplification for classes today
    const dayOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayOfWeek = dayOfWeekMap[today.getDay()];
    const { count: classesToday } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativa')
      .contains('days_of_week', [currentDayOfWeek]);

    return {
      generalRate,
      presentToday,
      totalScheduledToday,
      absentToday,
      classesToday: classesToday || 0,
    };

  } catch (error: any) {
    console.error("Error in getAttendanceStats:", error.message);
    return {
      generalRate: 0,
      presentToday: 0,
      totalScheduledToday: 0,
      absentToday: 0,
      classesToday: 0,
    };
  }
}
