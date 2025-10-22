'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getGraphQLServerClient } from '@/lib/graphql/server';
import { getServerUser } from '@/lib/auth/session';

const strongPasswordSchema = z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
  .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial.');


const signupSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: strongPasswordSchema,
  role: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const forgotPasswordSchema = z.object({
    email: z.string().email('E-mail inválido.'),
});

const updatePasswordSchema = z.object({
    password: strongPasswordSchema,
});


export async function signup(formData: unknown, adminCreation = false) {
  const parsedData = signupSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Dados do formulário inválidos.', errors: parsedData.error.flatten().fieldErrors };
  }
  
  const { name, email, password, role } = parsedData.data;
  
  try {
    const client = await getGraphQLServerClient();
    const password_hash = await bcrypt.hash(password, 10);

    const insertUserMutation = /* GraphQL */ `
      mutation InsertUser($email: String!, $password_hash: String!, $full_name: String, $role: String) {
        insert_users_one(object: { email: $email, password_hash: $password_hash, full_name: $full_name, role: $role }) { id }
      }
    `;

    const userRes = await client.request(insertUserMutation, {
      email: email.toLowerCase().trim(),
      password_hash,
      full_name: name,
      role: role || 'user',
    });

    const userId = userRes?.insert_users_one?.id as string | undefined;
    if (!userId) {
      return { success: false, message: 'Falha ao criar usuário.' };
    }

    const upsertProfileMutation = /* GraphQL */ `
      mutation UpsertProfile($id: uuid!, $full_name: String, $role: String) {
        insert_profiles_one(
          object: { id: $id, full_name: $full_name, role: $role },
          on_conflict: { constraint: profiles_pkey, update_columns: [full_name, role, updated_at] }
        ) { id }
      }
    `;

    await client.request(upsertProfileMutation, {
      id: userId,
      full_name: name,
      role: role || 'user',
    });

    const message = adminCreation
      ? 'Usuário criado com sucesso!'
      : 'Cadastro realizado com sucesso. Faça login para continuar.';

    return { success: true, message };
  } catch (error: any) {
    console.error('Erro no signup:', error);
    const msg = error?.response?.errors?.[0]?.message || 'Erro interno do servidor';
    return { success: false, message: msg };
  }
}

export async function login(formData: unknown) {
    const parsedData = loginSchema.safeParse(formData);

    if (!parsedData.success) {
      return { error: { message: 'Dados do formulário inválidos' } };
    }

    const { email, password } = parsedData.data;
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        return { error: { message: data?.error?.message || 'E-mail ou senha incorretos' } };
      }
      return { success: true, user: data.user };
    } catch (error) {
      return { error: { message: 'Erro interno do servidor' } };
    }
}

export async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        redirect('/login');
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        redirect('/login');
    }
}

export async function forgotPassword(formData: unknown) {
  const parsedData = forgotPasswordSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'E-mail inválido.' };
  }

  // Fluxo de e-mail de recuperação ainda não implementado sem serviço de e-mail.
  // Podemos registrar uma solicitação para o admin ou implementar envio via provider posteriormente.
  return { success: true, message: 'Se o e-mail existir, entraremos em contato com instruções de redefinição em breve.' };
}

export async function updatePassword(formData: unknown) {
    const parsedData = updatePasswordSchema.safeParse(formData);

    if (!parsedData.success) {
        return { success: false, message: 'Dados inválidos.', errors: parsedData.error.flatten().fieldErrors };
    }

    const { password } = parsedData.data;
    const user = getServerUser();
    if (!user?.id) {
      return { success: false, message: 'Usuário não autenticado.' };
    }

    try {
      const client = await getGraphQLServerClient();
      const password_hash = await bcrypt.hash(password, 10);
      const updatePasswordMutation = /* GraphQL */ `
        mutation UpdatePassword($id: uuid!, $password_hash: String!) {
          update_users_by_pk(pk_columns: {id: $id}, _set: { password_hash: $password_hash }) { id }
        }
      `;
      await client.request(updatePasswordMutation, { id: user.id, password_hash });
      return { success: true, message: 'Senha atualizada com sucesso!' };
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      const msg = error?.response?.errors?.[0]?.message || 'Erro interno do servidor';
      return { success: false, message: msg };
    }
}
