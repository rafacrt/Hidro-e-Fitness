'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
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
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar os professores.');
    }

    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
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
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('instructors').insert([
      {
        name: parsedData.data.name,
        email: parsedData.data.email,
        phone: parsedData.data.phone.replace(/\D/g, ''),
        specialties: parsedData.data.specialties,
        availability: parsedData.data.availability,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao cadastrar professor: ${error.message}` };
    }

    revalidatePath('/professores');
    return { success: true, message: 'Professor cadastrado com sucesso!' };
  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
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
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
        .from('instructors')
        .update({
            name: parsedData.data.name,
            email: parsedData.data.email,
            phone: parsedData.data.phone.replace(/\D/g, ''),
            specialties: parsedData.data.specialties,
            availability: parsedData.data.availability,
        })
        .eq('id', id);

        if (error) {
            console.error('Supabase Error:', error);
            return { success: false, message: `Erro ao atualizar professor: ${error.message}` };
        }

        revalidatePath('/professores');
        return { success: true, message: 'Professor atualizado com sucesso!' };

    } catch (error) {
        console.error('Unexpected Error:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}

export async function deleteInstructor(id: string) {
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from('instructors').delete().eq('id', id);

        if (error) {
            console.error('Supabase Error:', error);
            return { success: false, message: `Erro ao excluir professor: ${error.message}` };
        }

        revalidatePath('/professores');
        return { success: true, message: 'Professor excluído com sucesso!' };

    } catch (error) {
        console.error('Unexpected Error:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}
