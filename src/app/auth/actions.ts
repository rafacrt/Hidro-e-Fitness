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
    return { error: { message: 'Invalid form data' } };
  }
  
  const { name, email, password } = parsedData.data;
  const supabase = await createSupabaseServerClient();
  const origin = headers().get('origin');

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
    return { error };
  }

  // No redirect here, user needs to confirm email.
  return {};
}

export async function login(formData: unknown) {
    const parsedData = loginSchema.safeParse(formData);

    if (!parsedData.success) {
      return { error: { message: 'Invalid form data' } };
    }

    const { email, password } = parsedData.data;
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return { error };
    }

    redirect('/dashboard');
}

export async function logout() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/login');
}
