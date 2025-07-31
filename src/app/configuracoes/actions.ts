'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/lib/database.types';
import { signup } from '../auth/actions';

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

// --- Academy Settings Actions ---

export async function getAcademySettings(): Promise<AcademySettings | null> {
    try {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from('academy_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // No rows found, which is fine
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

export async function uploadLogo(formData: FormData) {
    const file = formData.get('logo') as File;
    if (!file || file.size === 0) {
        return { success: false, message: 'Nenhum arquivo selecionado.' };
    }

    try {
        const supabase = await createSupabaseServerClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: settings } = await supabase.from('academy_settings').select('logo_url').single();
        if (settings?.logo_url) {
            const oldFileName = settings.logo_url.split('/').pop();
            if (oldFileName) {
                await supabase.storage.from('logos').remove([oldFileName]);
            }
        }

        const { error: uploadError } = await supabase.storage
            .from('logos')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Supabase Upload Error:', uploadError);
            return { success: false, message: `Erro no upload: ${uploadError.message}` };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('logos')
            .getPublicUrl(filePath);

        const { error: updateError } = await supabase
            .from('academy_settings')
            .update({ logo_url: publicUrl })
            .eq('id', 1);
            
        if (updateError) {
            console.error('Supabase Update Error:', updateError);
            await supabase.storage.from('logos').remove([filePath]);
            return { success: false, message: `Erro ao atualizar logo: ${updateError.message}` };
        }
        
        revalidatePath('/configuracoes');
        revalidatePath('/', 'layout');
        return { success: true, message: 'Logo atualizado com sucesso!', logoUrl: publicUrl };

    } catch (error) {
        console.error('Unexpected Error:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}

// --- User Management Actions ---

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
    // We use the signup server action, but with adminCreation flag set to true
    const result = await signup(formData, true);
    if (result.success) {
        revalidatePath('/configuracoes');
    }
    return result;
}
