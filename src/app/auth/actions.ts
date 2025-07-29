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
    console.log('🔐 === INICIANDO LOGIN SERVER ACTION ===');
    
    const parsedData = loginSchema.safeParse(formData);

    if (!parsedData.success) {
      console.error('❌ Dados do formulário inválidos:', parsedData.error);
      return { error: { message: 'Dados do formulário inválidos' } };
    }

    const { email, password } = parsedData.data;
    
    console.log('📧 E-mail:', email);
    console.log('🔑 Senha fornecida:', password ? 'SIM' : 'NÃO');
    
    try {
      console.log('🔧 Criando cliente Supabase...');
      const supabase = await createSupabaseServerClient();
      
      console.log('🔄 Tentando autenticar no Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(), // Garantir que email esteja limpo
          password
      });

      console.log('📊 Resposta do Supabase:');
      console.log('- Data:', data);
      console.log('- Error:', error);

      if (error) {
          console.error('❌ Erro do Supabase:', error);
          
          // Mapear erros específicos do Supabase
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
          console.log('✅ Login realizado com sucesso!');
          console.log('👤 Usuário:', data.user.email);
          console.log('🎫 Sessão:', data.session.access_token ? 'Criada' : 'Erro');
          
          // Verificar se o usuário existe na tabela profiles
          console.log('👥 Verificando perfil do usuário...');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError) {
            console.error('⚠️ Erro ao buscar perfil:', profileError);
            // Não falhar o login por causa disso
          } else {
            console.log('👤 Perfil encontrado:', profile);
          }
          
          console.log('🔄 Redirecionando para dashboard...');
          redirect('/dashboard');
      }

      console.error('❌ Falha na autenticação - sem sessão');
      return { error: { message: 'Falha na autenticação' } };
    } catch (error) {
        console.error('💥 Erro inesperado no login:', error);
        return { error: { message: 'Erro interno do servidor' } };
    }
}

export async function logout() {
    try {
        console.log('🚪 Fazendo logout...');
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
        console.log('✅ Logout realizado com sucesso');
        redirect('/login');
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        redirect('/login');
    }
}