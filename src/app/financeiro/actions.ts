
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
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
    const client = getGraphQLServerClient();
    
    // Converter "R$ 180,00" para número 180.00
    let amountAsNumber = Number(data.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    if (data.type === 'despesa') {
      amountAsNumber = -Math.abs(amountAsNumber);
    }

    // Se vamos quitar uma cobrança existente, atualizar pagamento
    if (existing_payment_id) {
      const mutation = `
        mutation QuitPayment($id: uuid!, $changes: payments_set_input!) {
          update_payments_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
        }
      `;
      await client.request(mutation, {
        id: existing_payment_id,
        changes: {
          status: 'pago',
          paid_at: new Date().toISOString(),
          payment_method: data.payment_method,
          amount: amountAsNumber,
        },
      });
      revalidatePath('/financeiro');
      revalidatePath('/alunos');
      return { success: true, message: 'Cobrança quitada com sucesso!' };
    }

    // Caso contrário, criar nova transação
    const mutation = `
      mutation InsertPayment($object: payments_insert_input!) {
        insert_payments_one(object: $object) { id }
      }
    `;
    await client.request(mutation, {
      object: {
        description: `${data.category} - ${data.description}`,
        amount: amountAsNumber,
        due_date: toDateOnlyISOString(data.due_date),
        payment_method: data.payment_method,
        status: data.status,
        student_id: student_id,
        category: data.category,
        type: data.type,
      },
    });

    revalidatePath('/financeiro');
    revalidatePath('/alunos');
    return { success: true, message: 'Transação registrada com sucesso!' };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message || 'Falha na requisição GraphQL'}` };
  }
}

export async function getTransactions(type: 'receita' | 'despesa' | 'all'): Promise<Payment[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query Payments($where: payments_bool_exp, $orderBy: [payments_order_by!]) {
        payments(where: $where, order_by: $orderBy) {
          id
          description
          amount
          due_date
          payment_method
          status
          student_id
          category
          type
          created_at
          paid_at
        }
      }
    `;
    let where: any = null;
    if (type === 'receita') {
      where = { amount: { _gt: 0 } };
    } else if (type === 'despesa') {
      where = { amount: { _lt: 0 } };
    }
    const data = await client.request(query, {
      where,
      orderBy: [{ created_at: 'desc' }],
    });
    return data.payments as Payment[];
  } catch (error) {
    console.error('GraphQL Error:', error);
    return [];
  }
}

export async function getPendingPayments(studentId: string): Promise<Payment[]> {
  if (!studentId) return [];
  try {
    const client = getGraphQLServerClient();
    const query = `
      query PendingPayments($studentId: String!) {
        payments(where: { student_id: { _eq: $studentId }, status: { _in: ["pendente", "vencido"] } }, order_by: { due_date: asc }) {
          id
          description
          amount
          due_date
          payment_method
          status
          student_id
          category
          type
          created_at
          paid_at
        }
      }
    `;
    const data = await client.request(query, { studentId });
    return data.payments as Payment[];
  } catch (error) {
    console.error('GraphQL Error fetching pending payments:', error);
    return [];
  }
}

export async function getAllStudentPayments(studentId: string): Promise<Payment[]> {
  if (!studentId) return [];
  try {
    const client = getGraphQLServerClient();
    const query = `
      query AllStudentPayments($studentId: String!) {
        payments(where: { student_id: { _eq: $studentId } }, order_by: { due_date: desc }) {
          id
          description
          amount
          due_date
          payment_method
          status
          student_id
          category
          type
          created_at
          paid_at
        }
      }
    `;
    const data = await client.request(query, { studentId });
    return data.payments as Payment[];
  } catch (error) {
    console.error('GraphQL Error fetching student payments:', error);
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
    const client = getGraphQLServerClient();
    let amountAsNumber = Number(parsedData.data.amount.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    
    if (parsedData.data.type === 'despesa') {
      amountAsNumber = -Math.abs(amountAsNumber);
    }

    const mutation = `
      mutation UpdatePayment($id: uuid!, $changes: payments_set_input!) {
        update_payments_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
      }
    `;
    await client.request(mutation, {
      id,
      changes: {
        description: `${parsedData.data.category} - ${parsedData.data.description}`,
        amount: amountAsNumber,
        due_date: toDateOnlyISOString(parsedData.data.due_date),
        payment_method: parsedData.data.payment_method,
        status: parsedData.data.status,
        category: parsedData.data.category,
        type: parsedData.data.type,
      },
    });

    revalidatePath('/financeiro');
    return { success: true, message: 'Transação atualizada com sucesso!' };
  } catch (error: any) {
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message || 'Falha na requisição GraphQL'}` };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation DeletePayment($id: uuid!) {
        delete_payments_by_pk(id: $id) { id }
      }
    `;
    await client.request(mutation, { id });

    revalidatePath('/financeiro');
    return { success: true, message: 'Transação excluída com sucesso!' };
  } catch (error: any) {
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message || 'Falha na requisição GraphQL'}` };
  }
}

export async function generateMonthlyPayments(month: Date) {
  try {
    const client = getGraphQLServerClient();
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthName = format(month, 'MMMM yyyy', { locale: ptBR });
    const dueDate = new Date(month.getFullYear(), month.getMonth(), 10); // Vencimento dia 10

    // 1. Buscar matrículas ativas com planos da modalidade da turma
    const query = `
      query EnrollmentsAndExistingPayments($monthStart: date!, $monthEnd: date!) {
        enrollments(where: { students: { status: { _eq: "ativo" } } }) {
          student_id
          students { name status }
          classes {
            modalities {
              plans { name price recurrence }
            }
          }
        }
        payments(where: { due_date: { _gte: $monthStart, _lte: $monthEnd }, description: { _ilike: "%Mensalidade%" } }) {
          student_id
        }
      }
    `;
    const data = await client.request(query, {
      monthStart: toDateOnlyISOString(monthStart),
      monthEnd: toDateOnlyISOString(monthEnd),
    });

    const enrollments = data.enrollments || [];
    const existingPayments = data.payments || [];

    const billedStudentIds = new Set(existingPayments.map((p: any) => p.student_id));
    const newPayments: any[] = [];
    let processedStudents = 0;

    for (const enrollment of enrollments) {
      if (!enrollment.students || enrollment.students.status !== 'ativo' || billedStudentIds.has(enrollment.student_id)) {
        continue;
      }

      // Simplificação: Assume o primeiro plano mensal encontrado para a modalidade da turma
      const plan = (enrollment.classes?.modalities?.plans || []).find((p: any) => p.recurrence === 'mensal');
      
      if (plan) {
        newPayments.push({
          student_id: enrollment.student_id,
          description: `Mensalidade - ${plan.name} - ${monthName}`,
          amount: plan.price,
          due_date: toDateOnlyISOString(dueDate),
          status: 'pendente',
        });
        billedStudentIds.add(enrollment.student_id);
        processedStudents++;
      }
    }

    if (newPayments.length > 0) {
      const mutation = `
        mutation InsertPayments($objects: [payments_insert_input!]!) {
          insert_payments(objects: $objects) { affected_rows }
        }
      `;
      await client.request(mutation, { objects: newPayments });
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
    const client = getGraphQLServerClient();
    const mutation = `
      mutation PaySelected($ids: [uuid!]!, $paidAt: timestamptz!) {
        update_payments(where: { id: { _in: $ids } }, _set: { status: "pago", paid_at: $paidAt }) { affected_rows }
      }
    `;
    await client.request(mutation, { ids: paymentIds, paidAt: new Date().toISOString() });

    revalidatePath('/financeiro');
    return { success: true, message: `${paymentIds.length} transação(ões) marcada(s) como paga(s).` };
  } catch (error: any) {
    return { success: false, message: `Erro ao pagar transações: ${error.message || 'Falha na requisição GraphQL'}` };
  }
}

export async function scheduleSelectedPayments(paymentIds: string[], newDueDate: Date) {
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation ScheduleSelected($ids: [uuid!]!, $newDueDate: date!) {
        update_payments(
          where: { id: { _in: $ids } },
          _set: { due_date: $newDueDate, status: "pendente" }
        ) { affected_rows }
      }
    `;
    await client.request(mutation, { ids: paymentIds, newDueDate: toDateOnlyISOString(newDueDate) });

    revalidatePath('/financeiro');
    return { success: true, message: `${paymentIds.length} transação(ões) reagendada(s).` };
  } catch (error: any) {
    return { success: false, message: `Erro ao agendar pagamentos: ${error.message || 'Falha na requisição GraphQL'}` };
  }
}
