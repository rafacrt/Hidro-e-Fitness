
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';

type Payment = Database['public']['Tables']['payments']['Row'];

interface PaymentStats {
  totalVolume: number;
  totalCount: number;
  approvedVolume: number;
  pendingVolume: number;
  overdueVolume: number;
}

export async function getPayments(filters: { status?: string; query?: string }): Promise<Payment[]> {
  try {
    const supabase = await createSupabaseServerClient();
    let queryBuilder = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'all') {
      queryBuilder = queryBuilder.eq('status', filters.status);
    }
    
    // Simple query for description for now
    if (filters.query) {
      queryBuilder = queryBuilder.ilike('description', `%${filters.query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar os pagamentos.');
    }

    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
    return [];
  }
}

export async function getPaymentStats(): Promise<PaymentStats> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('payments').select('amount, status');

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar as estatísticas de pagamento.');
    }

    const stats = data.reduce((acc, payment) => {
      const amount = payment.amount || 0;
      acc.totalVolume += amount;
      acc.totalCount += 1;
      if (payment.status === 'pago') {
        acc.approvedVolume += amount;
      } else if (payment.status === 'pendente') {
        acc.pendingVolume += amount;
      } else if (payment.status === 'vencido') {
        acc.overdueVolume += amount;
      }
      return acc;
    }, {
      totalVolume: 0,
      totalCount: 0,
      approvedVolume: 0,
      pendingVolume: 0,
      overdueVolume: 0,
    });

    return stats;

  } catch (error) {
    console.error('Unexpected Error:', error);
    return {
      totalVolume: 0,
      totalCount: 0,
      approvedVolume: 0,
      pendingVolume: 0,
      overdueVolume: 0,
    };
  }
}
