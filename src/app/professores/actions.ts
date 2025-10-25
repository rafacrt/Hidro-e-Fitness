'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type Instructor = Database['public']['Tables']['instructors']['Row'];

const instructorFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  phone: z.string().min(10, 'Telefone inválido.'),
  specialties: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Selecione pelo menos uma especialidade.',
  }),
  availability: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Selecione pelo menos um dia de disponibilidade.',
  }),
});

export async function getInstructors(): Promise<Instructor[]> {
  try {
    const client = getGraphQLServerClient();
    const query = `
      query GetInstructors {
        instructors(order_by: { created_at: desc }) {
          id
          name
          email
          phone
          specialties
          availability
          created_at
        }
      }
    `;
    const data = await client.request(query);
    return (data.instructors || []) as Instructor[];
  } catch (error) {
    console.error('GraphQL Error:', error);
    return [];
  }
}

export async function addInstructor(formData: unknown) {
  const parsedData = instructorFormSchema.safeParse(formData);

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
      mutation InsertInstructor($object: instructors_insert_input!) {
        insert_instructors_one(object: $object) { id }
      }
    `;
    const object = {
      name: parsedData.data.name,
      email: parsedData.data.email,
      phone: parsedData.data.phone.replace(/\D/g, ''),
      specialties: parsedData.data.specialties,
      availability: parsedData.data.availability,
    };
    await client.request(mutation, { object });

    revalidatePath('/professores');
    return { success: true, message: 'Professor cadastrado com sucesso!' };
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
  }
}

export async function updateInstructor(id: string, formData: unknown) {
  const parsedData = instructorFormSchema.safeParse(formData);

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
      mutation UpdateInstructor($id: uuid!, $changes: instructors_set_input!) {
        update_instructors_by_pk(pk_columns: { id: $id }, _set: $changes) { id }
      }
    `;
    const changes = {
      name: parsedData.data.name,
      email: parsedData.data.email,
      phone: parsedData.data.phone.replace(/\D/g, ''),
      specialties: parsedData.data.specialties,
      availability: parsedData.data.availability,
    };
    await client.request(mutation, { id, changes });

    revalidatePath('/professores');
    return { success: true, message: 'Professor atualizado com sucesso!' };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
  }
}

export async function deleteInstructor(id: string) {
  try {
    const client = getGraphQLServerClient();
    const mutation = `
      mutation DeleteInstructor($id: uuid!) {
        delete_instructors_by_pk(id: $id) { id }
      }
    `;
    await client.request(mutation, { id });

    revalidatePath('/professores');
    return { success: true, message: 'Professor excluído com sucesso!' };

  } catch (error: any) {
    console.error('GraphQL Error:', error);
    return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
  }
}
