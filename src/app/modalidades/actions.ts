
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'] & { modalities: Pick<Modality, 'name'> | null };


const modalityFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  description: z.string().optional(),
});

const planFormSchema = z.object({
  name: z.string().min(3, 'O nome do plano deve ter pelo menos 3 caracteres.'),
  modality_id: z.string({ required_error: 'Selecione uma modalidade.' }).min(1, 'Selecione uma modalidade.'),
  price: z.string().min(1, 'O preço é obrigatório.'),
  recurrence: z.enum(['mensal', 'trimestral', 'semestral', 'anual']),
  benefits: z.string().optional(),
  status: z.enum(['ativo', 'inativo']).default('ativo'),
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

export async function getPlans(): Promise<Plan[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('plans')
      .select(`
        *,
        modalities ( name )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar os planos.');
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

    // 1. Check if any classes are using this modality
    const { count, error: checkError } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('modality_id', id);

    if (checkError) {
      console.error('Supabase Check Error:', checkError);
      return { success: false, message: `Erro ao verificar turmas: ${checkError.message}` };
    }

    if (count !== null && count > 0) {
      return { 
        success: false, 
        message: `Não é possível excluir esta modalidade, pois ela está associada a ${count} turma(s). Por favor, altere ou remova as turmas antes.` 
      };
    }

    // 2. If no classes are using it, proceed with deletion
    const { error } = await supabase.from('modalidades').delete().eq('id', id);

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
    const supabase = await createSupabaseServerClient();
    const priceAsNumber = Number(parsedData.data.price.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    const benefitsArray = parsedData.data.benefits?.split(',').map(b => b.trim()).filter(b => b) || [];

    const { error } = await supabase.from('plans').insert([
      {
        name: parsedData.data.name,
        modality_id: parsedData.data.modality_id,
        price: priceAsNumber,
        recurrence: parsedData.data.recurrence,
        benefits: benefitsArray,
        status: parsedData.data.status,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao cadastrar plano: ${error.message}` };
    }

    revalidatePath('/modalidades');
    return { success: true, message: 'Plano cadastrado com sucesso!' };
  } catch (error: any) {
    console.error('Unexpected Error:', error);
    return { success: false, message: `Ocorreu um erro inesperado: ${error.message}` };
  }
}
