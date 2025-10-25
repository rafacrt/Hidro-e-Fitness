
'use server';

import type { Database } from '@/lib/database.types';
import { getGraphQLServerClient } from '@/lib/graphql/server';

export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row'];
export interface PaymentStats {
    totalVolume: number;
    approvedVolume: number;
    pendingVolume: number;
    overdueVolume: number;
    totalCount: number;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    const client = getGraphQLServerClient();
    const query = `
      query PaymentMethods {
        payment_methods {
          id
          name
        }
      }
    `;
    try {
      const data = await client.request(query);
      return (data.payment_methods || []) as PaymentMethod[];
    } catch (error: any) {
      console.error('Error fetching payment methods (GraphQL):', error);
      return [];
    }
}

export async function getPaymentStats(): Promise<PaymentStats> {
    const client = getGraphQLServerClient();
    const query = `
      query PaymentStats {
        payments {
          amount
          status
        }
      }
    `;
    try {
      const data = await client.request(query);
      const payments = data.payments || [];
      return payments.reduce((acc: PaymentStats, p: any) => {
        const amount = p.amount || 0;
        acc.totalVolume += amount;
        acc.totalCount += 1;
        if (p.status === 'pago') acc.approvedVolume += amount;
        if (p.status === 'pendente') acc.pendingVolume += amount;
        if (p.status === 'vencido') acc.overdueVolume += amount;
        return acc;
      }, { totalVolume: 0, approvedVolume: 0, pendingVolume: 0, overdueVolume: 0, totalCount: 0 });
    } catch (error: any) {
      console.error('Error fetching payments for stats (GraphQL):', error);
      return { totalVolume: 0, approvedVolume: 0, pendingVolume: 0, overdueVolume: 0, totalCount: 0 };
    }
}
