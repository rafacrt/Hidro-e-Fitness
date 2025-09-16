
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const processPaymentSchema = z.object({
  student_id: z.string(),
  items: z.array(z.object({
    id: z.string().optional(), // id of existing payment to be settled
    description: z.string(),
    amount: z.number(),
    type: z.enum(['receita', 'despesa']).default('receita'),
    category: z.string(),
  })),
  payment_method: z.string(),
  total: z.number(),
});

type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;

export async function processPayment(data: ProcessPaymentInput) {
  const supabase = await createSupabaseServerClient();
  
  const toUpdate = data.items.filter(item => item.id);
  const toInsert = data.items.filter(item => !item.id);

  try {
    // Update existing pending payments
    if (toUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'pago',
          paid_at: new Date().toISOString(),
          payment_method: data.payment_method,
        })
        .in('id', toUpdate.map(item => item.id!));
      
      if (updateError) throw updateError;
    }

    // Insert new payments (for avulso items)
    if (toInsert.length > 0) {
      const newPayments = toInsert.map(item => ({
        student_id: data.student_id,
        description: `${item.category} - ${item.description}`,
        amount: item.amount,
        due_date: new Date().toISOString().split('T')[0], // today
        status: 'pago',
        paid_at: new Date().toISOString(),
        payment_method: data.payment_method,
        type: item.type,
        category: item.category,
      }));
      
      const { error: insertError } = await supabase
        .from('payments')
        .insert(newPayments);

      if (insertError) throw insertError;
    }

    revalidatePath('/caixa');
    revalidatePath('/financeiro');
    revalidatePath('/alunos');

    return { success: true, message: 'Pagamento processado com sucesso!' };

  } catch (error: any) {
    console.error("Error processing payment:", error);
    return { success: false, message: `Erro ao processar pagamento: ${error.message}` };
  }
}
