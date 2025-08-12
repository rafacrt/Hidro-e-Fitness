'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];

const modalityFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  description: z.string().optional(),
});

export async function getModalities(): Promise<Modality[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('modalities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar as modalidades.');
    }

    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
    return [];
  }
}

export async function getModalitiesStats() {
    const supabase = await createSupabaseServerClient();

    const { count: totalStudents, error: studentsError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

    const { data: revenueData, error: revenueError } = await supabase
        .from('payments')
        .select('amount')
        .gt('amount', 0);
    
    if (studentsError || revenueError) {
        console.error('Error fetching modalities stats:', studentsError || revenueError);
        return { totalStudents: 0, totalRevenue: 0 };
    }

    const totalRevenue = revenueData.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    return {
        totalStudents: totalStudents || 0,
        totalRevenue: totalRevenue || 0,
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
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('modalities').insert([
      {
        name: parsedData.data.name,
        description: parsedData.data.description,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao cadastrar modalidade: ${error.message}` };
    }

    revalidatePath('/modalidades');
    return { success: true, message: 'Modalidade cadastrada com sucesso!' };
  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
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
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('modalities')
      .update({
        name: parsedData.data.name,
        description: parsedData.data.description,
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao atualizar modalidade: ${error.message}` };
    }

    revalidatePath('/modalidades');
    return { success: true, message: 'Modalidade atualizada com sucesso!' };
  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function deleteModality(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('modalities').delete().eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao excluir modalidade: ${error.message}` };
    }

    revalidatePath('/modalidades');
    return { success: true, message: 'Modalidade excluída com sucesso!' };
  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}
