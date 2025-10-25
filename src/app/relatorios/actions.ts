
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
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
    const client = getGraphQLServerClient();

    const query = `
      query ReportStats {
        generated_reports: reports_aggregate { aggregate { count } }
        revenue_paid: payments_aggregate(where: { status: { _eq: "pago" }, type: { _eq: "receita" } }) {
          aggregate { sum { amount } }
        }
        active_students: students_aggregate(where: { status: { _eq: "ativo" } }) { aggregate { count } }
        attendance_total: attendance_aggregate { aggregate { count } }
        attendance_present: attendance_aggregate(where: { status: { _eq: "presente" } }) { aggregate { count } }
      }
    `;

    const data = await client.request(query);

    const generatedReports = data.generated_reports?.aggregate?.count ?? 0;
    const totalRevenue = data.revenue_paid?.aggregate?.sum?.amount ?? 0;
    const activeStudents = data.active_students?.aggregate?.count ?? 0;
    const totalAttendance = data.attendance_total?.aggregate?.count ?? 0;
    const presentAttendance = data.attendance_present?.aggregate?.count ?? 0;
    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

    return {
      generatedReports,
      totalRevenue,
      activeStudents,
      attendanceRate,
    };
  } catch (error) {
    console.error('Error fetching report stats (GraphQL):', error);
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
    const client = getGraphQLServerClient();
    const query = `
      query MostUsedReports {
        reports(order_by: { times_generated: desc }, limit: 4) {
          id
          name
          times_generated
          created_at
          updated_at
        }
      }
    `;
    const data = await client.request(query);
    return (data.reports || []) as Report[];
  } catch (error) {
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
