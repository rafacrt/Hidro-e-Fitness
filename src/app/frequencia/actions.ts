
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
import { startOfDay, endOfDay } from 'date-fns';



export interface AttendanceStats {
  generalRate: number;
  presentToday: number;
  totalScheduledToday: number;
  absentToday: number;
  classesToday: number;
}

export async function getAttendanceStats(): Promise<AttendanceStats> {
  try {
    const client = getGraphQLServerClient();
    const today = new Date();
    const dayOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayOfWeek = dayOfWeekMap[today.getDay()];

    const query = `
      query AttendanceStats($startOfDay: timestamptz!, $endOfDay: timestamptz!, $currentDay: String!) {
        attendance_total: attendance_aggregate { aggregate { count } }
        attendance_present_total: attendance_aggregate(where: { status: { _eq: "presente" } }) { aggregate { count } }
        attendance_today_total: attendance_aggregate(where: { created_at: { _gte: $startOfDay, _lte: $endOfDay } }) { aggregate { count } }
        attendance_today_present: attendance_aggregate(where: { created_at: { _gte: $startOfDay, _lte: $endOfDay }, status: { _eq: "presente" } }) { aggregate { count } }
        attendance_today_absent: attendance_aggregate(where: { created_at: { _gte: $startOfDay, _lte: $endOfDay }, status: { _eq: "ausente" } }) { aggregate { count } }
        classes_today: classes_aggregate(where: { status: { _eq: "ativa" }, days_of_week: { _contains: [$currentDay] } }) { aggregate { count } }
      }
    `;

    const variables = {
      startOfDay: startOfDay(today).toISOString(),
      endOfDay: endOfDay(today).toISOString(),
      currentDay: currentDayOfWeek,
    };

    const data = await client.request(query, variables);

    const totalAttendance = data.attendance_total?.aggregate?.count ?? 0;
    const totalPresent = data.attendance_present_total?.aggregate?.count ?? 0;
    const generalRate = totalAttendance > 0 ? (totalPresent / totalAttendance) * 100 : 0;

    const totalScheduledToday = data.attendance_today_total?.aggregate?.count ?? 0;
    const presentToday = data.attendance_today_present?.aggregate?.count ?? 0;
    const absentToday = data.attendance_today_absent?.aggregate?.count ?? 0;

    const classesToday = data.classes_today?.aggregate?.count ?? 0;

    return {
      generalRate,
      presentToday,
      totalScheduledToday,
      absentToday,
      classesToday,
    };
  } catch (error: any) {
    console.error('Error in getAttendanceStats (GraphQL):', error?.message || error);
    return {
      generalRate: 0,
      presentToday: 0,
      totalScheduledToday: 0,
      absentToday: 0,
      classesToday: 0,
    };
  }
}
