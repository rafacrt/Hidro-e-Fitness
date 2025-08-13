
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Payment = Database['public']['Tables']['payments']['Row'];

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netFlow: number;
  currentBalance: number;
  transactions: Payment[];
}

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
    let amountAsNumber = Number(parsedData.data.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

    if (parsedData.data.type === 'despesa') {
      amountAsNumber = -Math.abs(amountAsNumber);
    }

    const { error } = await supabase.from('payments').insert([
      {
        description: `${parsedData.data.category} - ${parsedData.data.description}`,
        amount: amountAsNumber,
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

export async function getTransactions(type: 'receita' | 'despesa' | 'all'): Promise<Payment[]> {
    try {
        const supabase = await createSupabaseServerClient();
        let query = supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

        if (type === 'receita') {
            query = query.gt('amount', 0);
        } else if (type === 'despesa') {
            query = query.lt('amount', 0);
        }

        const { data, error } = await query;

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

export async function getFinancialSummary(): Promise<FinancialSummary> {
  try {
    const transactions = await getTransactions('all');
    
    const summary = transactions.reduce((acc, t) => {
      const amount = t.amount || 0;
      if (amount > 0) {
        acc.totalRevenue += amount;
      } else {
        acc.totalExpenses += amount;
      }
      acc.currentBalance += amount;
      return acc;
    }, {
      totalRevenue: 0,
      totalExpenses: 0,
      netFlow: 0,
      currentBalance: 0,
    });

    summary.netFlow = summary.totalRevenue + summary.totalExpenses;

    return {
      ...summary,
      transactions,
    };

  } catch (error) {
    console.error('Error in getFinancialSummary:', error);
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netFlow: 0,
      currentBalance: 0,
      transactions: [],
    };
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
        let amountAsNumber = Number(parsedData.data.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
        
        if (parsedData.data.type === 'despesa') {
            amountAsNumber = -Math.abs(amountAsNumber);
        }

        const { error } = await supabase
            .from('payments')
            .update({
                description: `${parsedData.data.category} - ${parsedData.data.description}`,
                amount: amountAsNumber,
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

export async function generateMonthlyPayments(month: Date) {
  try {
    const supabase = await createSupabaseServerClient();
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthName = format(month, 'MMMM yyyy', { locale: ptBR });
    const dueDate = new Date(month.getFullYear(), month.getMonth(), 10); // Vencimento dia 10

    // 1. Buscar todas as matrículas ativas com detalhes
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        student_id,
        students ( name, status ),
        classes (
          modalities (
            plans ( name, price, recurrence )
          )
        )
      `)
      .eq('students.status', 'ativo');
      
    if (enrollmentsError) throw new Error(`Erro ao buscar matrículas: ${enrollmentsError.message}`);

    // 2. Buscar pagamentos já existentes para o mês
    const { data: existingPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('student_id')
      .gte('due_date', monthStart.toISOString())
      .lte('due_date', monthEnd.toISOString())
      .like('description', `%Mensalidade%`);

    if (paymentsError) throw new Error(`Erro ao buscar pagamentos existentes: ${paymentsError.message}`);

    const billedStudentIds = new Set(existingPayments.map(p => p.student_id));
    const newPayments: any[] = [];
    let processedStudents = 0;

    for (const enrollment of enrollments) {
      if (!enrollment.students || enrollment.students.status !== 'ativo' || billedStudentIds.has(enrollment.student_id)) {
        continue;
      }

      // Simplificação: Assume o primeiro plano mensal encontrado para a modalidade da turma
      const plan = (enrollment.classes?.modalities?.plans || []).find(p => p.recurrence === 'mensal');
      
      if (plan) {
        newPayments.push({
          student_id: enrollment.student_id,
          description: `Mensalidade - ${plan.name} - ${monthName}`,
          amount: plan.price,
          due_date: dueDate.toISOString(),
          status: 'pendente',
          category: 'Mensalidades',
          type: 'receita',
        });
        billedStudentIds.add(enrollment.student_id); // Garante que não será cobrado de novo no mesmo lote
        processedStudents++;
      }
    }

    if (newPayments.length > 0) {
      const { error: insertError } = await supabase.from('payments').insert(newPayments);
      if (insertError) throw new Error(`Erro ao inserir novos pagamentos: ${insertError.message}`);
    }

    revalidatePath('/financeiro');
    return { success: true, message: `${processedStudents} mensalidades geradas com sucesso!` };

  } catch (error: any) {
    console.error('Erro ao gerar mensalidades:', error);
    return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
  }
}
