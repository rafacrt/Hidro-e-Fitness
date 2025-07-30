
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];

const studentFormSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    cpf: z.string().refine((cpf) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf), 'CPF inválido.'),
    birthDate: z.date({ required_error: 'A data de nascimento é obrigatória.' }),
    email: z.string().email('E-mail inválido.'),
    phone: z.string().min(10, 'Telefone inválido.'),
    isWhatsApp: z.boolean().default(false),
    cep: z.string().refine((cep) => /^\d{5}-\d{3}$/.test(cep), 'CEP inválido.'),
    street: z.string().min(1, 'A rua é obrigatória.'),
    number: z.string().min(1, 'O número é obrigatório.'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'O bairro é obrigatório.'),
    city: z.string().min(1, 'A cidade é obrigatória.'),
    state: z.string().min(1, 'O estado é obrigatório.'),
    responsibleName: z.string().optional(),
    responsiblePhone: z.string().optional(),
    medicalObservations: z.string().optional(),
    status: z.enum(['ativo', 'inativo']).default('ativo'),
  });

export async function addStudent(formData: unknown) {
  const parsedData = studentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('students')
      .insert([
        {
          name: parsedData.data.name,
          cpf: parsedData.data.cpf.replace(/\D/g, ''),
          birth_date: parsedData.data.birthDate.toISOString(),
          email: parsedData.data.email,
          phone: parsedData.data.phone.replace(/\D/g, ''),
          is_whatsapp: parsedData.data.isWhatsApp,
          cep: parsedData.data.cep.replace(/\D/g, ''),
          street: parsedData.data.street,
          number: parsedData.data.number,
          complement: parsedData.data.complement,
          neighborhood: parsedData.data.neighborhood,
          city: parsedData.data.city,
          state: parsedData.data.state,
          responsible_name: parsedData.data.responsibleName,
          responsible_phone: parsedData.data.responsiblePhone?.replace(/\D/g, ''),
          medical_observations: parsedData.data.medicalObservations,
          status: 'ativo',
        },
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao cadastrar aluno: ${error.message}` };
    }

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno cadastrado com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
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
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('students')
      .update({
        name: parsedData.data.name,
        cpf: parsedData.data.cpf.replace(/\D/g, ''),
        birth_date: parsedData.data.birthDate.toISOString(),
        email: parsedData.data.email,
        phone: parsedData.data.phone.replace(/\D/g, ''),
        is_whatsapp: parsedData.data.isWhatsApp,
        cep: parsedData.data.cep.replace(/\D/g, ''),
        street: parsedData.data.street,
        number: parsedData.data.number,
        complement: parsedData.data.complement,
        neighborhood: parsedData.data.neighborhood,
        city: parsedData.data.city,
        state: parsedData.data.state,
        responsible_name: parsedData.data.responsibleName,
        responsible_phone: parsedData.data.responsiblePhone?.replace(/\D/g, ''),
        medical_observations: parsedData.data.medicalObservations,
        status: parsedData.data.status,
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao atualizar aluno: ${error.message}` };
    }

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno atualizado com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function deleteStudent(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('students').delete().eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao excluir aluno: ${error.message}` };
    }

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno excluído com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}


export async function getStudents({ query, status }: { query: string; status: string }): Promise<Student[]> {
  try {
    const supabase = await createSupabaseServerClient();
    let queryBuilder = supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%,cpf.ilike.%${query}%`);
    }

    if (status && status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status);
    }
    
    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar os alunos.');
    }

    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
    return [];
  }
}
