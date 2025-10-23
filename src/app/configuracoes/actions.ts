'use server';

import { revalidatePath } from 'next/cache';
import type { Database } from '@/lib/database.types';
import { signup } from '../auth/actions';
import { z } from 'zod';
import { getGraphQLServerClient } from '@/lib/graphql/server';
import { getServerUser } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';
import { getGraphQLClient } from '@/lib/graphql/client'
import { Pool } from 'pg'

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export async function getUserProfile(): Promise<Profile | null> {
  try {
    const user = getServerUser();
    if (!user?.id) return null;
    const client = await getGraphQLServerClient();
    const query = /* GraphQL */ `
      query GetProfile($id: uuid!) {
        profiles_by_pk(id: $id) { id full_name avatar_url role email }
      }
    `;
    const res = await client.request(query, { id: user.id });
    return res?.profiles_by_pk ?? null;
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
    const user = getServerUser();
    if (!user?.id) {
      return { success: false, message: 'Usuário não autenticado.' };
    }

    // Enviar arquivo para storage local via API
    const uploadRes = await fetch(`/api/storage/upload?type=avatar`, {
      method: 'POST',
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok || !uploadJson?.url) {
      return { success: false, message: uploadJson?.message || 'Erro no upload do arquivo.' };
    }

    const avatarUrl: string = uploadJson.url;

    // Atualizar perfil com URL local via Hasura
    const client = await getGraphQLServerClient();
    const updateMutation = /* GraphQL */ `
      mutation UpdateAvatar($id: uuid!, $avatar_url: String, $updated_at: timestamptz) {
        update_profiles_by_pk(pk_columns: {id: $id}, _set: { avatar_url: $avatar_url, updated_at: $updated_at }) { id avatar_url }
      }
    `;
    await client.request(updateMutation, { id: user.id, avatar_url: avatarUrl, updated_at: new Date().toISOString() });

    revalidatePath('/configuracoes');
    return { success: true, message: 'Avatar atualizado com sucesso!', avatarUrl };

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
    const user = getServerUser();
    if (!user?.id) {
      return { success: false, message: 'Usuário não autenticado.' };
    }

    const uploadRes = await fetch(`/api/storage/upload?type=logo`, {
      method: 'POST',
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok || !uploadJson?.url) {
      return { success: false, message: uploadJson?.message || 'Erro no upload do arquivo.' };
    }

    const logoUrl: string = uploadJson.url;

    const client = await getGraphQLServerClient();
    const updateMutation = /* GraphQL */ `
      mutation UpdateLogo($logo_url: String!) {
        update_academy_settings(where: { id: { _eq: 1 } }, _set: { logo_url: $logo_url }) { affected_rows }
      }
    `;
    await client.request(updateMutation, { logo_url: logoUrl });

    revalidatePath('/configuracoes');
    return { success: true, message: 'Logo atualizada com sucesso!', logoUrl };

  } catch (error) {
    console.error('Erro ao atualizar logo:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})
export async function getAcademySettings(): Promise<AcademySettings | null> {
  try {
    const client = await getGraphQLServerClient();
    const query = /* GraphQL */ `
      query GetSettings { academy_settings(limit: 1) { id name logo_url } }
    `;
    const res = await client.request(query);
    const row = res?.academy_settings?.[0] ?? null;
    return row;
  } catch (error) {
    console.error('Unexpected Error getAcademySettings (user role):', error);
    // Tenta com admin secret
    try {
      const adminClient = getGraphQLClient();
      const query = /* GraphQL */ `
        query GetSettings { academy_settings(limit: 1) { id name logo_url } }
      `;
      const res = await adminClient.request(query);
      const row = res?.academy_settings?.[0] ?? null;
      if (row) return row;
    } catch (e2) {
      console.error('Fallback to admin secret failed:', e2);
    }

    // Fallback direto ao Postgres
    try {
      const { rows } = await pgPool.query('SELECT id, name, logo_url FROM public.academy_settings WHERE id = 1');
      const row = rows?.[0] ?? null;
      return row ?? null;
    } catch (e3) {
      console.error('Postgres fallback failed:', e3);
      return null;
    }
  }
}

export async function updateAcademySettings(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) {
    return { success: false, message: 'O nome da academia é obrigatório.' };
  }

  try {
    const client = await getGraphQLServerClient();
    const mutation = /* GraphQL */ `
      mutation UpdateSettings($name: String!) {
        update_academy_settings(where: { id: { _eq: 1 } }, _set: { name: $name }) { affected_rows }
      }
    `;
    const res = await client.request(mutation, { name });
    if (!res?.update_academy_settings?.affected_rows) {
      return { success: false, message: 'Nenhum registro atualizado.' };
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
    const client = await getGraphQLServerClient();
    const query = /* GraphQL */ `
      query GetUsers { profiles { id full_name role email avatar_url } }
    `;
    const res = await client.request(query);
    return res?.profiles ?? [];
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
    const client = await getGraphQLServerClient();
    const mutation = /* GraphQL */ `
      mutation UpdateUserRole($id: uuid!, $full_name: String!, $role: String!, $now: timestamptz!) {
        update_profiles_by_pk(pk_columns: { id: $id }, _set: { full_name: $full_name, role: $role, updated_at: $now }) { id }
      }
    `;
    await client.request(mutation, { id: userId, full_name: name, role, now: new Date().toISOString() });

    revalidatePath('/configuracoes');
    return { success: true, message: 'Usuário atualizado com sucesso!' };
  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const client = await getGraphQLServerClient();
    const mutation = /* GraphQL */ `
      mutation DeleteUser($id: uuid!) { delete_users_by_pk(id: $id) { id } }
    `;
    await client.request(mutation, { id: userId });

    // Perfil será removido por CASCADE se FK estiver configurada com ON DELETE CASCADE
    revalidatePath('/configuracoes');
    return { success: true, message: 'Usuário excluído com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error deleting user:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

// Permitir que apenas Desenvolvedor (admin) altere a senha de qualquer usuário
const setPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial.'),
});

export async function setUserPassword(userId: string, formData: unknown) {
  const parsed = setPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.', errors: parsed.error.flatten().fieldErrors };
  }

  const me = getServerUser();
  if (!me?.id) {
    return { success: false, message: 'Usuário não autenticado.' };
  }
  // JWT usa papéis 'admin' | 'user'. Mapeamos Desenvolvedor -> 'admin'.
  if (me.role !== 'admin') {
    return { success: false, message: 'Permissão negada. Apenas desenvolvedor pode alterar senhas.' };
  }

  try {
    const client = await getGraphQLServerClient();
    const password_hash = await bcrypt.hash(parsed.data.password, 10);
    const mutation = /* GraphQL */ `
      mutation SetUserPassword($id: uuid!, $password_hash: String!) {
        update_users_by_pk(pk_columns: { id: $id }, _set: { password_hash: $password_hash }) { id }
      }
    `;
    await client.request(mutation, { id: userId, password_hash });

    revalidatePath('/configuracoes');
    return { success: true, message: 'Senha atualizada com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao definir senha de usuário:', error);
    const msg = error?.response?.errors?.[0]?.message || 'Erro interno do servidor';
    return { success: false, message: msg };
  }
}
