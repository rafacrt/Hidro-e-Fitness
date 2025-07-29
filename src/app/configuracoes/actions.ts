'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

    // Upload da imagem para o bucket 'avatars'
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      return { success: false, message: `Erro no upload: ${uploadError.message}` };
    }

    // Obter a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Atualizar a tabela de profiles com a nova URL do avatar
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Supabase Update Error:', updateError);
      // Opcional: remover a imagem do storage se a atualização do perfil falhar
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
