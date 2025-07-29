'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export async function signup(formData: unknown) {
  const parsedData = signupSchema.safeParse(formData);

  if (!parsedData.success) {
    return { error: { message: 'Dados do formulário inválidos' } };
  }
  
  const { name, email, password } = parsedData.data;
  
  try {
    const supabase = await createSupabaseServerClient();
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Erro no signup:', error);
      return { error: { message: error.message } };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro no signup:', error);
    return { error: { message: 'Erro interno do servidor' } };
  }
}

export async function login(formData: unknown) {
    const parsedData = loginSchema.safeParse(formData);

    if (!parsedData.success) {
      return { error: { message: 'Dados do formulário inválidos' } };
    }

    const { email, password } = parsedData.data;
    
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
      });

      if (error) {
          console.error('Erro no login:', error);
          return { error: { message: 'E-mail ou senha incorretos' } };
      }

      if (data.session) {
          console.log('Login realizado com sucesso:', data.user?.email);
          redirect('/dashboard');
      }

      return { error: { message: 'Falha na autenticação' } };
    } catch (error) {
        console.error('Erro no login:', error);
        return { error: { message: 'Erro interno do servidor' } };
    }
}

export async function logout() {
    try {
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
        redirect('/login');
    } catch (error) {
        console.error('Erro no logout:', error);
        redirect('/login');
    }
}