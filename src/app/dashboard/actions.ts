
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
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
  const client = getGraphQLServerClient();
  const today = new Date();

  try {
    const dayOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayOfWeek = dayOfWeekMap[today.getDay()];
    const startOfCurrentMonth = startOfMonth(today).toISOString();
    const endOfCurrentMonth = endOfMonth(today).toISOString();

    const query = `
      query DashboardStats($start: timestamptz!, $end: timestamptz!, $currentDay: String!) {
        active_students: students_aggregate(where: { status: { _eq: "ativo" } }) {
          aggregate { count }
        }
        classes_today: classes_aggregate(
          where: { status: { _eq: "ativa" }, days_of_week: { _contains: [$currentDay] } }
        ) {
          aggregate { count }
        }
        monthly_revenue: payments_aggregate(
          where: { amount: { _gt: 0 }, status: { _eq: "pago" }, created_at: { _gte: $start, _lte: $end } }
        ) {
          aggregate { sum { amount } }
        }
        attendance_total: attendance_aggregate(where: { created_at: { _gte: $start, _lte: $end } }) {
          aggregate { count }
        }
        attendance_present: attendance_aggregate(where: { status: { _eq: "presente" }, created_at: { _gte: $start, _lte: $end } }) {
          aggregate { count }
        }
      }
    `;

    const data = await client.request(query, { start: startOfCurrentMonth, end: endOfCurrentMonth, currentDay: currentDayOfWeek });

    const activeStudents = data.active_students?.aggregate?.count ?? 0;
    const classesToday = data.classes_today?.aggregate?.count ?? 0;
    const monthlyRevenue = data.monthly_revenue?.aggregate?.sum?.amount ?? 0;
    const totalAttendance = data.attendance_total?.aggregate?.count ?? 0;
    const presentAttendance = data.attendance_present?.aggregate?.count ?? 0;
    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    return {
      activeStudents,
      classesToday,
      monthlyRevenue,
      attendanceRate,
    };
  } catch (error: any) {
    console.error('Error fetching dashboard stats (GraphQL):', error.message || error);
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
    const client = getGraphQLServerClient();
    const today = new Date();
    const dayOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayOfWeek = dayOfWeekMap[today.getDay()];

    const query = `
      query UpcomingClasses($currentDay: String!) {
        classes(
          where: { status: { _eq: "ativa" }, days_of_week: { _contains: [$currentDay] } },
          order_by: { start_time: asc },
          limit: 5
        ) {
          id
          name
          status
          days_of_week
          start_time
          end_time
          instructor_id
          instructors { name }
        }
      }
    `;

    const data = await client.request(query, { currentDay: currentDayOfWeek });
    return (data.classes || []) as any;
  } catch (error) {
    console.error('Unexpected error fetching upcoming classes (GraphQL):', error);
    return [];
  }
}
