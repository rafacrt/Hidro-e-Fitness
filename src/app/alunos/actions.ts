'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const studentFormSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    cpf: z.string().refine((cpf) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf), 'CPF inválido.'),
    birthDate: z.date({ required_error: 'A data de nascimento é obrigatória.' }),
    email: z.string().email('E-mail inválido.'),
    phone: z.string().min(10, 'Telefone inválido.'),
    isWhatsApp: z.boolean().default(false),
    cep: z.string().refine((cep) => /^\d{5}-\d{3}$/.test(cep), 'CEP inválido.'),
    street: z.string().min(1, 'A rua é obrigatória.'),
    number: z.string().min(1, 'O número é obrigatório.'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'O bairro é obrigatório.'),
    city: z.string().min(1, 'A cidade é obrigatória.'),
    state: z.string().min(1, 'O estado é obrigatório.'),
    responsibleName: z.string().optional(),
    responsiblePhone: z.string().optional(),
    medicalObservations: z.string().optional(),
  });

export async function addStudent(formData: unknown) {
  const parsedData = studentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    console.error('Validation Error:', parsedData.error);
    return {
      success: false,
      message: 'Dados do formulário inválidos.',
      errors: parsedData.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      name,
      cpf,
      birthDate,
      email,
      phone,
      isWhatsApp,
      cep,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      responsibleName,
      responsiblePhone,
      medicalObservations,
    } = parsedData.data;

    const { error } = await supabase
      .from('students')
      .insert([
        {
          name,
          cpf: cpf.replace(/\D/g, ''),
          birth_date: birthDate.toISOString(),
          email,
          phone: phone.replace(/\D/g, ''),
          is_whatsapp: isWhatsApp,
          cep: cep.replace(/\D/g, ''),
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          responsible_name: responsibleName,
          responsible_phone: responsiblePhone,
          medical_observations: medicalObservations,
          status: 'ativo',
        },
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, message: `Erro ao cadastrar aluno: ${error.message}` };
    }

    revalidatePath('/alunos');
    return { success: true, message: 'Aluno cadastrado com sucesso!' };

  } catch (error) {
    console.error('Unexpected Error:', error);
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}
