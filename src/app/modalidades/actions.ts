
'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'] & { modality: Pick<Modality, 'name'> | null };


const modalityFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  description: z.string().optional(),
});

const planFormSchema = z.object({
  name: z.string().min(3, 'O nome do plano deve ter pelo menos 3 caracteres.'),
  modality_id: z.string({ required_error: 'Selecione uma modalidade.' }).min(1, 'Selecione uma modalidade.'),
  price: z.string().min(1, 'O preço é obrigatório.'),
  recurrence: z.enum(['diaria', 'semanal', 'mensal', 'bimestral', 'trimestral', 'semestral', 'anual']),
  benefits: z.string().optional(),
  status: z.enum(['ativo', 'inativo']).default('ativo'),
});

export async function getModalities(): Promise<Modality[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetModalities {
        modalities(order_by: { created_at: desc }) {
          id
          name
          description
          price
          created_at
        }
      }
    `;
    const data = await client.request(query);
    return data.modalities as Modality[];
  } catch (error) {
    console.error('GraphQL Error:', error);
    return [];
  }
}

export async function getPlans(): Promise<Plan[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetPlans {
        plans(order_by: { created_at: desc }) {
          id
          name
          modality_id
          price
          recurrence
          benefits
          status
          created_at
          modality { name }
        }
      }
    `;
    const data = await client.request(query);
    return data.plans as Plan[];
  } catch (error) {
    console.error('GraphQL Error getting plans:', error);
    return [];
  }
}

export async function getModalitiesStats() {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetModalitiesStats {
        enrollments_aggregate { aggregate { count } }
        payments_aggregate(where: { amount: { _gt: 0 } }) { aggregate { sum { amount } } }
      }
    `;
    const data = await client.request(query);
    const totalStudents = data.enrollments_aggregate?.aggregate?.count ?? 0;
    const totalRevenue = data.payments_aggregate?.aggregate?.sum?.amount ?? 0;
    return { totalStudents, totalRevenue };
  } catch (error) {
    console.error('GraphQL Error:', error);
    return { totalStudents: 0, totalRevenue: 0 };
  }
}


export async function addModality(formData: unknown) {
  const parsedData = modalityFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation AddModality($object: modalities_insert_input!) {
        insert_modalities_one(object: $object) { id }
      }
    `;
    await client.request(mutation, {
      object: {
        name: parsedData.data.name,
        description: parsedData.data.description ?? null,
      },
    });

    revalidatePath('/modalidades');
    revalidatePath('/financeiro');
    return { success: true, message: 'Modalidade cadastrada com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: `Erro ao cadastrar modalidade: ${error.message ?? 'Falha na requisição GraphQL'}` };
  }
}

export async function updateModality(id: string, formData: unknown) {
  const parsedData = modalityFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation UpdateModality($id: uuid!, $changes: modalities_set_input!) {
        update_modalities_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
      }
    `;
    await client.request(mutation, {
      id,
      changes: {
        name: parsedData.data.name,
        description: parsedData.data.description ?? null,
      },
    });

    revalidatePath('/modalidades');
    revalidatePath('/financeiro');
    return { success: true, message: 'Modalidade atualizada com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: `Erro ao atualizar modalidade: ${error.message ?? 'Falha na requisição GraphQL'}` };
  }
}

export async function deleteModality(id: string) {
  try {
    const client = getGraphQLServerClient();

    // 1. Verificar se há turmas usando esta modalidade
    const checkQuery = `
      query CheckClasses($id: uuid!) {
        classes_aggregate(where: { modality_id: { _eq: $id } }) {
          aggregate { count }
        }
      }
    `;
    const checkRes = await client.request(checkQuery, { id });
    const count = checkRes.classes_aggregate?.aggregate?.count ?? 0;

    if (count > 0) {
      return {
        success: false,
        message: `Não é possível excluir esta modalidade, pois ela está associada a ${count} turma(s). Por favor, altere ou remova as turmas antes.`
      };
    }

    // 2. Excluir modalidade
    const mutation = `
      mutation DeleteModality($id: uuid!) {
        delete_modalities_by_pk(id: $id) { id }
      }
    `;
    await client.request(mutation, { id });

    revalidatePath('/modalidades');
    revalidatePath('/financeiro');
    return { success: true, message: 'Modalidade excluída com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: `Erro ao excluir modalidade: ${error.message ?? 'Falha na requisição GraphQL'}` };
  }
}


export async function addPlan(formData: unknown) {
  const parsedData = planFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  
  if (!parsedData.data.modality_id) {
    return { success: false, message: 'É necessário selecionar uma modalidade válida.' };
  }

  try {
    const client = getGraphQLServerClient();
    const priceAsNumber = Number(parsedData.data.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    const benefitsArray = parsedData.data.benefits?.split(',').map(b => b.trim()).filter(b => b) || [];

    const mutation = `
      mutation AddPlan($object: plans_insert_input!) {
        insert_plans_one(object: $object) { id }
      }
    `;
    await client.request(mutation, {
      object: {
        name: parsedData.data.name,
        modality_id: parsedData.data.modality_id,
        price: priceAsNumber,
        recurrence: parsedData.data.recurrence,
        benefits: benefitsArray,
        status: parsedData.data.status,
      },
    });

    revalidatePath('/modalidades');
    revalidatePath('/financeiro');
    return { success: true, message: 'Plano cadastrado com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message ?? 'Falha na requisição GraphQL'}` };
  }
}


export async function updatePlan(id: string, formData: unknown) {
  const parsedData = planFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }
  
  if (!parsedData.data.modality_id) {
    return { success: false, message: 'É necessário selecionar uma modalidade válida.' };
  }

  try {
    const client = getGraphQLServerClient();
    const priceAsNumber = Number(parsedData.data.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    const benefitsArray = parsedData.data.benefits?.split(',').map(b => b.trim()).filter(b => b) || [];

    const mutation = `
      mutation UpdatePlan($id: uuid!, $changes: plans_set_input!) {
        update_plans_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
      }
    `;
    await client.request(mutation, {
      id,
      changes: {
        name: parsedData.data.name,
        modality_id: parsedData.data.modality_id,
        price: priceAsNumber,
        recurrence: parsedData.data.recurrence,
        benefits: benefitsArray,
        status: parsedData.data.status,
      },
    });

    revalidatePath('/modalidades');
    revalidatePath('/financeiro');
    return { success: true, message: 'Plano atualizado com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message ?? 'Falha na requisição GraphQL'}` };
  }
}

export async function deletePlan(id: string) {
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation DeletePlan($id: uuid!) {
        delete_plans_by_pk(id: $id) { id }
      }
    `;
    await client.request(mutation, { id });

    revalidatePath('/modalidades');
    revalidatePath('/financeiro');
    return { success: true, message: 'Plano excluído com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message ?? 'Falha na requisição GraphQL'}` };
  }
}
