'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/lib/database.types';
import { signup } from '../auth/actions';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];


export async function getUserProfile(): Promise<Profile | null> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Supabase Error getting profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected Error getting profile:', error);
        return null;
    }
}


export async function uploadAvatar(formData: FormData) {
  const file = formData.get('avatar') as File;
  if (!file || file.size === 0) {
    return { success: false, message: 'Nenhum arquivo selecionado.' };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: 'Usuário não autenticado.' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      return { success: false, message: `Erro no upload: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Supabase Update Error:', updateError);
      await supabase.storage.from('avatars').remove([filePath]);
      return { success: false, message: `Erro ao atualizar perfil: ${updateError.message}` };
    }

    revalidatePath('/configuracoes');
    return { success: true, message: 'Avatar atualizado com sucesso!', avatarUrl: publicUrl };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function getAcademySettings(): Promise<AcademySettings | null> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('academy_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; 
            console.error('Supabase Error getAcademySettings:', error);
            throw new Error('Não foi possível buscar as configurações da academia.');
        }
        return data;
    } catch (error) {
        console.error('Unexpected Error getAcademySettings:', error);
        return null;
    }
}

export async function updateAcademySettings(formData: FormData) {
    const name = formData.get('name') as string;
    if (!name) {
        return { success: false, message: 'O nome da academia é obrigatório.' };
    }

    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase
            .from('academy_settings')
            .update({ name })
            .eq('id', 1);

        if (error) {
            console.error('Supabase Update Error:', error);
            return { success: false, message: `Erro ao atualizar dados: ${error.message}` };
        }

        revalidatePath('/configuracoes');
        return { success: true, message: 'Dados da academia atualizados com sucesso!' };
    } catch (error) {
        console.error('Unexpected Error:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}

export async function getUsers(): Promise<Profile[]> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) {
            console.error('Supabase Error getUsers:', error);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Unexpected Error getUsers:', error);
        return [];
    }
}

export async function addUser(formData: unknown) {
    const result = await signup(formData, true);
    if (result.success) {
        revalidatePath('/configuracoes');
    }
    return result;
}


const editUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  role: z.string({ required_error: 'Selecione um perfil.' }),
});

export async function updateUserRole(userId: string, formData: unknown) {
  const parsedData = editUserSchema.safeParse(formData);
  if (!parsedData.success) {
    return { success: false, message: 'Dados inválidos.', errors: parsedData.error.flatten().fieldErrors };
  }

  const { name, role } = parsedData.data;

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name, role: role })
      .eq('id', userId);

    if (error) {
      console.error('Supabase Update Error:', error);
      return { success: false, message: `Erro ao atualizar usuário: ${error.message}` };
    }

    revalidatePath('/configuracoes');
    return { success: true, message: 'Usuário atualizado com sucesso!' };
  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function deleteUser(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { success: false, message: 'Variáveis de ambiente do Supabase não configuradas para esta ação.' };
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Supabase Admin Error deleting user:', authError);
      if (authError.message !== 'User not found') {
          return { success: false, message: `Erro ao excluir usuário da autenticação: ${authError.message}` };
      }
    }
    
    const supabase = await createSupabaseServerClient();
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
    
    if (profileError) {
      console.error('Supabase Error deleting profile:', profileError);
    }

    revalidatePath('/configuracoes');
    return { success: true, message: 'Usuário excluído com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error deleting user:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}
