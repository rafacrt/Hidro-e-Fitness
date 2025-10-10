
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
  student_id: z.string().optional(),
  existing_payment_id: z.string().optional(),
});


// Helper function to convert a local date to a UTC-aligned ISO string for just the date part.
const toDateOnlyISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export async function addTransaction(formData: unknown) {
  const parsedData = transactionFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  
  const { existing_payment_id, student_id, ...data } = parsedData.data;

  try {
    const supabase = await createSupabaseServerClient();
    
    // Convert price string "R$ 180,00" to number 180.00
    let amountAsNumber = Number(data.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    if (data.type === 'despesa') {
      amountAsNumber = -Math.abs(amountAsNumber);
    }

    // If we are paying off an existing payment, update it
    if (existing_payment_id) {
        const { error } = await supabase
            .from('payments')
            .update({
                status: 'pago',
                paid_at: new Date().toISOString(),
                payment_method: data.payment_method,
                amount: amountAsNumber, // Allow amount adjustment
            })
            .eq('id', existing_payment_id);
        
        if (error) {
            console.error('Supabase Error updating payment:', error);
            return { success: false, message: `Erro ao quitar cobrança: ${error.message}` };
        }
        revalidatePath('/financeiro');
        revalidatePath('/alunos');
        return { success: true, message: 'Cobrança quitada com sucesso!' };
    }

    // Otherwise, create a new transaction
    const { error } = await supabase.from('payments').insert([
      {
        description: `${data.category} - ${data.description}`,
        amount: amountAsNumber,
        due_date: toDateOnlyISOString(data.due_date),
        payment_method: data.payment_method,
        status: data.status,
        student_id: student_id,
        category: data.category,
        type: data.type,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao registrar transação: ${error.message}` };
    }

    revalidatePath('/financeiro');
    revalidatePath('/alunos');
    return { success: true, message: 'Transação registrada com sucesso!' };

  } catch (error: any) {
    console.error('Unexpected Error:', error);
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message}` };
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

export async function getPendingPayments(studentId: string): Promise<Payment[]> {
    if (!studentId) return [];
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', studentId)
            .in('status', ['pendente', 'vencido'])
            .order('due_date', { ascending: true });

        if (error) {
            console.error('Supabase Error fetching pending payments:', error);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Unexpected error fetching pending payments:', error);
        return [];
    }
}

export async function getAllStudentPayments(studentId: string): Promise<Payment[]> {
    if (!studentId) return [];
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', studentId)
            .order('due_date', { ascending: false });

        if (error) {
            console.error('Supabase Error fetching student payments:', error);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Unexpected error fetching student payments:', error);
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
                due_date: toDateOnlyISOString(parsedData.data.due_date),
                payment_method: parsedData.data.payment_method,
                status: parsedData.data.status,
                category: parsedData.data.category,
                type: parsedData.data.type,
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
      .gte('due_date', toDateOnlyISOString(monthStart))
      .lte('due_date', toDateOnlyISOString(monthEnd))
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
          due_date: toDateOnlyISOString(dueDate),
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

export async function paySelectedPayments(paymentIds: string[]) {
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from('payments')
            .update({ status: 'pago', paid_at: new Date().toISOString() })
            .in('id', paymentIds);

        if (error) throw error;

        revalidatePath('/financeiro');
        return { success: true, message: `${paymentIds.length} transação(ões) marcada(s) como paga(s).` };
    } catch (error: any) {
        return { success: false, message: `Erro ao pagar transações: ${error.message}` };
    }
}

export async function scheduleSelectedPayments(paymentIds: string[], newDueDate: Date) {
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from('payments')
            .update({ due_date: toDateOnlyISOString(newDueDate), status: 'pendente' })
            .in('id', paymentIds);

        if (error) throw error;

        revalidatePath('/financeiro');
        return { success: true, message: `${paymentIds.length} transação(ões) reagendada(s).` };
    } catch (error: any) {
        return { success: false, message: `Erro ao agendar pagamentos: ${error.message}` };
    }
}
