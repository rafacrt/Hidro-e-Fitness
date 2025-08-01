'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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
    const supabase = await createSupabaseServerClient();
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role || 'Recepção', 
        },
        emailRedirectTo: adminCreation ? undefined : `${origin}/auth/callback`,
      },
    });

    if (signUpError) {
      console.error('Erro no signup:', signUpError);
      return { success: false, message: signUpError.message };
    }

    if (adminCreation && signUpData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: role || 'Recepção' })
        .eq('id', signUpData.user.id);
      
      if (profileError) {
        console.error('Erro ao atualizar perfil do usuário criado:', profileError);
      }
    }

    const message = adminCreation
      ? 'Usuário criado com sucesso!'
      : 'Verifique seu e-mail para confirmar sua conta.';

    return { success: true, message };
  } catch (error) {
    console.error('Erro no signup:', error);
    return { success: false, message: 'Erro interno do servidor' };
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
          email: email.toLowerCase().trim(),
          password
      });

      if (error) {
          let errorMessage = 'E-mail ou senha incorretos';
          
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'E-mail ou senha incorretos';
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'E-mail não confirmado. Verifique sua caixa de entrada.';
          } else if (error.message.includes('signups not allowed')) {
            errorMessage = 'Cadastros não permitidos no momento.';
          } else if (error.message.includes('Too many requests')) {
            errorMessage = 'Muitas tentativas. Aguarde alguns minutos.';
          } else {
            errorMessage = error.message;
          }
          
          return { error: { message: errorMessage } };
      }

      if (data.session && data.user) {
          return { success: true, user: data.user };
      }

      return { error: { message: 'Falha na autenticação' } };
    } catch (error) {
        return { error: { message: 'Erro interno do servidor' } };
    }
}

export async function logout() {
    try {
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
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

  const { email } = parsedData.data;
  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin = headersList.get('origin');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return { success: false, message: `Erro ao enviar e-mail: ${error.message}` };
  }

  return { success: true, message: 'E-mail de redefinição de senha enviado com sucesso.' };
}

export async function updatePassword(formData: unknown) {
    const parsedData = updatePasswordSchema.safeParse(formData);

    if (!parsedData.success) {
        return { success: false, message: 'Dados inválidos.', errors: parsedData.error.flatten().fieldErrors };
    }

    const { password } = parsedData.data;
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { success: false, message: `Erro ao atualizar senha: ${error.message}` };
    }

    return { success: true, message: 'Senha atualizada com sucesso!' };
}
