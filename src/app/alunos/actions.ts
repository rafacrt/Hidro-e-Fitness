
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';
import { validateCPF } from '@/lib/utils';
import { getPlans } from '../modalidades/actions';

type Student = Database['public']['Tables']['students']['Row'];

const studentFormSchema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório.'),
    cpf: z.string().optional().refine((val) => val ? validateCPF(val) : true, { message: "CPF inválido." }),
    birthDate: z.date().optional(),
    email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
    phone: z.string().optional(),
    isWhatsApp: z.boolean().default(false),
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    responsibleName: z.string().optional(),
    responsiblePhone: z.string().optional(),
    medicalObservations: z.string().optional(),
    status: z.enum(['ativo', 'inativo']).default('ativo'),
    class_id: z.string().optional(), // Para matrícula rápida em turma
    plan_ids: z.array(z.string()).optional(), // Para vincular planos
    payment_method: z.string().optional(), // Para pagamento inicial
    initial_payment_amount: z.string().optional(), // Valor do pagamento inicial (como string R$ 123,45)
  })
  .refine(
    (data) => {
      if (data.birthDate) {
        const today = new Date();
        const birthDate = new Date(data.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          return !!data.responsibleName && !!data.responsiblePhone;
        }
      }
      return true;
    },
    {
      message: 'Nome e telefone do responsável são obrigatórios para menores de 18 anos.',
      path: ['responsibleName'],
    }
  );

export async function addStudent(formData: unknown) {
  const parsedData = studentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  const { data: studentData } = parsedData;

  try {
    const client = getGraphQLServerClient();
    const cleanCpf = studentData.cpf?.replace(/\D/g, '') || null;

    // 1. Cadastrar o Aluno
    const insertStudentMutation = `
      mutation InsertStudent($object: students_insert_input!) {
        insert_students_one(object: $object) { id, created_at }
      }
    `;
    const { insert_students_one: newStudent } = await client.request(insertStudentMutation, {
      object: {
        name: studentData.name,
        cpf: cleanCpf,
        birth_date: studentData.birthDate?.toISOString() ?? null,
        email: studentData.email || null,
        phone: studentData.phone?.replace(/\D/g, '') ?? null,
        is_whatsapp: studentData.isWhatsApp,
        cep: studentData.cep?.replace(/\D/g, '') ?? null,
        street: studentData.street ?? null,
        number: studentData.number ?? null,
        complement: studentData.complement ?? null,
        neighborhood: studentData.neighborhood ?? null,
        city: studentData.city ?? null,
        state: studentData.state ?? null,
        responsible_name: studentData.responsibleName ?? null,
        responsible_phone: studentData.responsiblePhone?.replace(/\D/g, '') ?? null,
        medical_observations: studentData.medicalObservations ?? null,
        status: 'ativo',
      },
    });

    let message = 'Aluno cadastrado com sucesso!';

    // 2. Matricular em Turma (se selecionado)
    if (studentData.class_id && newStudent) {
      const enrollMutation = `
        mutation Enroll($object: enrollments_insert_input!) {
          insert_enrollments_one(object: $object) { id }
        }
      `;
      await client.request(enrollMutation, {
        object: {
          student_id: newStudent.id,
          class_id: studentData.class_id,
        },
      });
      message += ' e matriculado na turma!';
    }

    // 3. Vincular Planos (se selecionado)
    if (studentData.plan_ids && studentData.plan_ids.length > 0 && newStudent) {
      const studentPlansObjects = studentData.plan_ids.map((plan_id: string) => ({
        student_id: newStudent.id,
        plan_id,
      }));
      const insertStudentPlansMutation = `
        mutation InsertStudentPlans($objects: [student_plans_insert_input!]!) {
          insert_student_plans(objects: $objects) { affected_rows }
        }
      `;
      await client.request(insertStudentPlansMutation, { objects: studentPlansObjects });
      message += ` Vinculado a ${studentData.plan_ids.length} plano(s).`;
    }

    // 4. Registrar Pagamento Inicial (se preenchido)
    if (studentData.initial_payment_amount && studentData.payment_method && newStudent) {
      const amountAsNumber = Number(studentData.initial_payment_amount.replace('R$', '').replace(/\./g, '').replace(',', '.'));
      if (!isNaN(amountAsNumber) && amountAsNumber > 0) {
        const insertPaymentMutation = `
          mutation InsertPayment($object: payments_insert_input!) {
            insert_payments_one(object: $object) { id }
          }
        `;
        await client.request(insertPaymentMutation, {
          object: {
            student_id: newStudent.id,
            description: `Pagamento Inicial - Matrícula`,
            amount: amountAsNumber,
            due_date: new Date().toISOString().split('T')[0],
            status: 'pago',
            paid_at: new Date().toISOString(),
            payment_method: studentData.payment_method,
            type: 'receita',
            category: 'Matrículas',
          },
        });
        message += ' Pagamento inicial registrado.';
      }
    }

    revalidatePath('/alunos');
    revalidatePath('/turmas');
    revalidatePath('/financeiro');
    return { success: true, message };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    const msg = error?.message || 'Falha na requisição GraphQL';
    if (msg.includes('students_cpf_key')) {
      return { success: false, message: 'Já existe um aluno cadastrado com este CPF.' };
    }
    return { success: false, message: `Erro ao cadastrar aluno: ${msg}` };
  }
}

export async function updateStudent(id: string, formData: unknown) {
  const parsedData = studentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  
  try {
    const client = getGraphQLServerClient();
    const cleanCpf = parsedData.data.cpf?.replace(/\D/g, '') || null;

    const mutation = `
      mutation UpdateStudent($id: String!, $changes: students_set_input!) {
        update_students_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
      }
    `;
    await client.request(mutation, {
      id,
      changes: {
        name: parsedData.data.name,
        cpf: cleanCpf,
        birth_date: parsedData.data.birthDate?.toISOString() ?? null,
        email: parsedData.data.email || null,
        phone: parsedData.data.phone?.replace(/\D/g, '') ?? null,
        is_whatsapp: parsedData.data.isWhatsApp,
        cep: parsedData.data.cep?.replace(/\D/g, '') ?? null,
        street: parsedData.data.street ?? null,
        number: parsedData.data.number ?? null,
        complement: parsedData.data.complement ?? null,
        neighborhood: parsedData.data.neighborhood ?? null,
        city: parsedData.data.city ?? null,
        state: parsedData.data.state ?? null,
        responsible_name: parsedData.data.responsibleName ?? null,
        responsible_phone: parsedData.data.responsiblePhone?.replace(/\D/g, '') ?? null,
        medical_observations: parsedData.data.medicalObservations ?? null,
        status: parsedData.data.status,
      },
    });

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno atualizado com sucesso!' };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    const msg = error?.message || 'Falha ao atualizar aluno';
    if (msg.includes('students_cpf_key')) {
      return { success: false, message: 'Já existe um aluno cadastrado com este CPF.' };
    }
    return { success: false, message: `Erro ao atualizar aluno: ${msg}` };
  }
}

export async function deleteStudent(id: string) {
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation DeleteStudent($id: String!) {
        delete_students_by_pk(id: $id) { id }
      }
    `;
    await client.request(mutation, { id });

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno excluído com sucesso!' };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    const msg = error?.message || 'Falha ao excluir aluno';
    return { success: false, message: `Erro ao excluir aluno: ${msg}` };
  }
}


export async function getStudents(): Promise<Student[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetStudents {
        students(order_by: { created_at: desc }) {
          id
          name
          cpf
          birth_date
          email
          phone
          is_whatsapp
          cep
          street
          number
          complement
          neighborhood
          city
          state
          responsible_name
          responsible_phone
          medical_observations
          status
          created_at
        }
      }
    `;
    const data = await client.request(query);
    return data.students as Student[];
  } catch (error) {
    console.error('GraphQL Error:', error);
    return [];
  }
}

export type HistoryEvent = {
  date: string;
  type: 'enrollment' | 'payment' | 'attendance';
  title: string;
  description: string;
};

export async function getStudentHistory(studentId: string): Promise<HistoryEvent[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query StudentHistory($studentId: String!) {
        students_by_pk(id: $studentId) { created_at }
        enrollments(where: { student_id: { _eq: $studentId } }) {
          created_at
          classes { name }
        }
        payments(where: { student_id: { _eq: $studentId } }) {
          created_at
          description
          status
          amount
        }
        attendance(where: { student_id: { _eq: $studentId } }) {
          created_at
          status
          classes { name }
        }
      }
    `;
    const data = await client.request(query, { studentId });

    const history: HistoryEvent[] = [];

    data.enrollments?.forEach((e: any) => {
      history.push({
        date: e.created_at,
        type: 'enrollment',
        title: 'Matrícula realizada',
        description: `Aluno matriculado na turma "${e.classes?.name}".`,
      });
    });

    data.payments?.forEach((p: any) => {
      history.push({
        date: p.created_at,
        type: 'payment',
        title: p.status === 'pago' ? 'Pagamento Realizado' : 'Cobrança Gerada',
        description: `${p.description} - R$ ${p.amount}`,
      });
    });

    data.attendance?.forEach((a: any) => {
      history.push({
        date: a.created_at,
        type: 'attendance',
        title: a.status === 'presente' ? 'Presença Registrada' : 'Falta Registrada',
        description: `Status de ${a.status} na turma "${a.classes?.name}".`,
      });
    });

    if (data.students_by_pk?.created_at) {
      history.push({
        date: data.students_by_pk.created_at,
        type: 'enrollment',
        title: 'Cadastro Realizado',
        description: 'Aluno cadastrado no sistema.',
      });
    }

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('GraphQL Error in getStudentHistory:', error);
    return [];
  }
}

export async function getStudentPlans(studentId: string): Promise<Array<{ id: string; name: string }>> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query StudentPlans($studentId: String!) {
        student_plans(where: { student_id: { _eq: $studentId } }) {
          plans { id, name }
        }
      }
    `;
    const data = await client.request(query, { studentId });
    return (data.student_plans || [])
      .map((sp: any) => sp.plans as { id: string; name: string })
      .filter((plan: any) => plan && plan.id && plan.name);
  } catch (error) {
    console.error('GraphQL Error fetching student plans:', error);
    return [];
  }
}

export async function updateStudentPlans(studentId: string, planIds: string[]) {
  try {
    const client = getGraphQLServerClient();

    // 1. Buscar planos atuais
    const currentQuery = `
      query CurrentPlans($studentId: String!) {
        student_plans(where: { student_id: { _eq: $studentId } }) { plan_id }
      }
    `;
    const currentRes = await client.request(currentQuery, { studentId });
    const currentPlanIds: string[] = (currentRes.student_plans || []).map((p: any) => p.plan_id);
    const newPlanIds = planIds.filter(id => !currentPlanIds.includes(id));

    // 2. Remover planos existentes do aluno
    const deleteMutation = `
      mutation DeleteStudentPlans($studentId: String!) {
        delete_student_plans(where: { student_id: { _eq: $studentId } }) { affected_rows }
      }
    `;
    await client.request(deleteMutation, { studentId });

    // 3. Inserir novos planos
    if (planIds.length > 0) {
      const insertMutation = `
        mutation InsertStudentPlans($objects: [student_plans_insert_input!]!) {
          insert_student_plans(objects: $objects) { affected_rows }
        }
      `;
      const objects = planIds.map(plan_id => ({ student_id: studentId, plan_id }));
      await client.request(insertMutation, { objects });

      // 4. Criar cobrança inicial para planos recém-adicionados
      if (newPlanIds.length > 0) {
        const plansQuery = `
          query PlansDetails($ids: [uuid!]!) {
            plans(where: { id: { _in: $ids } }) { id, name, price, recurrence }
          }
        `;
        const plansRes = await client.request(plansQuery, { ids: newPlanIds });
        const today = new Date();
        const payments = (plansRes.plans || []).map((plan: any) => ({
          student_id: studentId,
          description: `Mensalidade - ${plan.name}`,
          amount: plan.price,
          due_date: today.toISOString().split('T')[0],
          status: 'pendente' as const,
        }));

        if (payments.length > 0) {
          const insertPaymentsMutation = `
            mutation InsertPayments($objects: [payments_insert_input!]!) {
              insert_payments(objects: $objects) { affected_rows }
            }
          `;
          await client.request(insertPaymentsMutation, { objects: payments });
        }
      }
    }

    revalidatePath('/alunos');
    revalidatePath('/financeiro');
    return { success: true, message: 'Planos do aluno atualizados com sucesso!' };
  } catch (error) {
    console.error('GraphQL Error updating student plans:', error);
    return { success: false, message: 'Falha ao atualizar planos do aluno.' };
  }
}

export async function syncStudentPlanPayments(studentId: string) {
  try {
    const client = getGraphQLServerClient();

    // 1. Planos ativos do aluno com detalhes
    const plansQuery = `
      query StudentPlans($studentId: String!) {
        student_plans(where: { student_id: { _eq: $studentId } }) {
          plans { id, name, price, recurrence }
        }
        payments(where: { student_id: { _eq: $studentId }, status: { _eq: "pendente" } }) {
          description
        }
      }
    `;
    const res = await client.request(plansQuery, { studentId });
    const studentPlans = res.student_plans || [];
    const existingPaymentDescriptions = new Set((res.payments || []).map((p: any) => p.description));

    // 2. Criar pagamentos que faltam
    const paymentsToCreate: Array<{ student_id: string; description: string; amount: number; due_date: string; status: 'pendente' }> = [];
    const today = new Date();

    for (const sp of studentPlans) {
      const plan = sp.plans as { id: string; name: string; price: number; recurrence: string } | null;
      if (!plan) continue;
      const description = `Mensalidade - ${plan.name}`;
      if (!existingPaymentDescriptions.has(description)) {
        paymentsToCreate.push({
          student_id: studentId,
          description,
          amount: plan.price,
          due_date: today.toISOString().split('T')[0],
          status: 'pendente',
        });
      }
    }

    // 3. Inserir novos pagamentos
    if (paymentsToCreate.length > 0) {
      const insertPaymentsMutation = `
        mutation InsertPayments($objects: [payments_insert_input!]!) {
          insert_payments(objects: $objects) { affected_rows }
        }
      `;
      await client.request(insertPaymentsMutation, { objects: paymentsToCreate });

      revalidatePath('/alunos');
      revalidatePath('/financeiro');
      return { success: true, message: `${paymentsToCreate.length} cobrança(s) criada(s) com sucesso!` };
    }

    return { success: true, message: 'Nenhuma cobrança pendente para criar.' };
  } catch (error) {
    console.error('GraphQL Error syncing student plan payments:', error);
    return { success: false, message: 'Erro ao sincronizar cobranças de planos.' };
  }
}


