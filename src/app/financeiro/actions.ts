
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const transactionFormSchema = z.object({
  type: z.enum(['receita', 'despesa'], { required_error: 'Selecione o tipo.' }),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres.'),
  amount: z.string().min(1, 'O valor é obrigatório.'),
  due_date: z.date({ required_error: 'A data é obrigatória.' }),
  category: z.string().min(1, 'Selecione uma categoria.'),
  payment_method: z.string().optional(),
  status: z.enum(['pago', 'pendente', 'vencido']).default('pago'),
});

export async function addTransaction(formData: unknown) {
  const parsedData = transactionFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    
    // Convert price string "R$ 180,00" to number 180.00
    const amountAsNumber = Number(parsedData.data.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

    const { error } = await supabase.from('payments').insert([
      {
        description: parsedData.data.description,
        amount: amountAsNumber,
        type: parsedData.data.type,
        due_date: parsedData.data.due_date.toISOString(),
        paid_at: parsedData.data.status === 'pago' ? new Date().toISOString() : null,
        category: parsedData.data.category,
        payment_method: parsedData.data.payment_method,
        status: parsedData.data.status,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao registrar transação: ${error.message}` };
    }

    revalidatePath('/financeiro');
    return { success: true, message: 'Transação registrada com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}
