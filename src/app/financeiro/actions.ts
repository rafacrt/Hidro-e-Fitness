
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type Payment = Database['public']['Tables']['payments']['Row'];

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
        description: `${parsedData.data.category} - ${parsedData.data.description}`,
        amount: amountAsNumber,
        type: parsedData.data.type,
        due_date: parsedData.data.due_date.toISOString(),
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


export async function getTransactions(type: 'receita' | 'despesa'): Promise<Payment[]> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('type', type)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error:', error);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Unexpected Error:', error);
        return [];
    }
}


export async function updateTransaction(id: string, formData: unknown) {
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
        const amountAsNumber = Number(parsedData.data.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

        const { error } = await supabase
            .from('payments')
            .update({
                description: `${parsedData.data.category} - ${parsedData.data.description}`,
                amount: amountAsNumber,
                type: parsedData.data.type,
                due_date: parsedData.data.due_date.toISOString(),
                payment_method: parsedData.data.payment_method,
                status: parsedData.data.status,
            })
            .eq('id', id);

        if (error) {
            return { success: false, message: `Erro ao atualizar transação: ${error.message}` };
        }

        revalidatePath('/financeiro');
        return { success: true, message: 'Transação atualizada com sucesso!' };
    } catch (error) {
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}

export async function deleteTransaction(id: string) {
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from('payments').delete().eq('id', id);

        if (error) {
            return { success: false, message: `Erro ao excluir transação: ${error.message}` };
        }

        revalidatePath('/financeiro');
        return { success: true, message: 'Transação excluída com sucesso!' };
    } catch (error) {
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}
