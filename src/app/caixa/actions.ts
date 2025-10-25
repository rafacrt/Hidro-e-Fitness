
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
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
  const client = getGraphQLServerClient();

  const toUpdate = data.items.filter(item => item.id);
  const toInsert = data.items.filter(item => !item.id);

  try {
    // Update existing pending payments (mark as paid)
    if (toUpdate.length > 0) {
      const mutationUpdate = /* GraphQL */ `
        mutation UpdatePayments($ids: [uuid!], $paid_at: timestamptz!, $payment_method: String!) {
          update_payments(
            where: { id: { _in: $ids } },
            _set: { status: "pago", paid_at: $paid_at, payment_method: $payment_method }
          ) {
            affected_rows
          }
        }
      `;
      const updateVars = {
        ids: toUpdate.map(item => item.id!),
        paid_at: new Date().toISOString(),
        payment_method: data.payment_method,
      };
      await client.request(mutationUpdate, updateVars);
    }

    // Insert new payments (avulso items)
    if (toInsert.length > 0) {
      const todayDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
      const objects = toInsert.map(item => ({
        student_id: data.student_id,
        description: `${item.category} - ${item.description}`,
        amount: item.amount,
        due_date: todayDate,
        status: 'pago',
        paid_at: new Date().toISOString(),
        payment_method: data.payment_method,
        type: item.type,
        category: item.category,
      }));

      const mutationInsert = /* GraphQL */ `
        mutation InsertPayments($objects: [payments_insert_input!]!) {
          insert_payments(objects: $objects) { affected_rows }
        }
      `;

      await client.request(mutationInsert, { objects });
    }

    revalidatePath('/caixa');
    revalidatePath('/financeiro');
    revalidatePath('/alunos');

    return { success: true, message: 'Pagamento processado com sucesso!' };

  } catch (error: any) {
    console.error('Error processing payment (GraphQL):', error);
    return { success: false, message: `Erro ao processar pagamento: ${error?.message || 'Erro inesperado.'}` };
  }
}
