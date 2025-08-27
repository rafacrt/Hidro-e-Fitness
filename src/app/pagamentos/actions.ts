
'use server';

import type { Database } from '@/lib/database.types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row'];
export interface PaymentStats {
    totalVolume: number;
    approvedVolume: number;
    pendingVolume: number;
    overdueVolume: number;
    totalCount: number;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('payment_methods').select('*');
    if (error) {
        console.error("Error fetching payment methods:", error);
        return [];
    }
    return data;
}

export async function getPaymentStats(): Promise<PaymentStats> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('payments').select('amount, status');

    if (error) {
        console.error("Error fetching payments for stats:", error);
        return { totalVolume: 0, approvedVolume: 0, pendingVolume: 0, overdueVolume: 0, totalCount: 0 };
    }

    return data.reduce((acc, p) => {
        const amount = p.amount || 0;
        acc.totalVolume += amount;
        acc.totalCount += 1;
        if (p.status === 'pago') acc.approvedVolume += amount;
        if (p.status === 'pendente') acc.pendingVolume += amount;
        if (p.status === 'vencido') acc.overdueVolume += amount;
        return acc;
    }, { totalVolume: 0, approvedVolume: 0, pendingVolume: 0, overdueVolume: 0, totalCount: 0 });
}
