'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Database } from '@/lib/database.types';

type Equipment = Database['public']['Tables']['equipments']['Row'];
type Maintenance = Database['public']['Tables']['maintenance_schedules']['Row'] & { equipments: Pick<Equipment, 'name'> | null };

// Schema for adding/updating equipment
const equipmentFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  category: z.string().min(1, 'A categoria é obrigatória.'),
  location: z.string().min(1, 'A localização é obrigatória.'),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  installation_date: z.date({ required_error: 'A data de instalação é obrigatória.' }),
  status: z.enum(['operacional', 'manutencao', 'quebrado']),
});

// Schema for adding/updating maintenance schedules
const maintenanceFormSchema = z.object({
  equipment_id: z.string({ required_error: 'Selecione um equipamento.' }),
  type: z.enum(['preventiva', 'corretiva', 'emergencial']),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  scheduled_date: z.date({ required_error: 'A data agendada é obrigatória.' }),
  responsible: z.string().optional(),
  cost: z.coerce.number().optional(),
  status: z.enum(['agendada', 'em_andamento', 'concluida', 'cancelada']),
});

// --- Equipment Actions ---

export async function getEquipments(): Promise<Equipment[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('equipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar os equipamentos.');
    }
    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
    return [];
  }
}

export async function addEquipment(formData: unknown) {
  const parsedData = equipmentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Dados do formulário inválidos.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('equipments').insert([{
      ...parsedData.data,
      installation_date: parsedData.data.installation_date.toISOString(),
    }]);

    if (error) {
      return { success: false, message: `Erro ao cadastrar equipamento: ${error.message}` };
    }

    revalidatePath('/manutencao');
    return { success: true, message: 'Equipamento cadastrado com sucesso!' };
  } catch (error) {
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}

// --- Maintenance Actions ---

export async function getMaintenances(): Promise<Maintenance[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('maintenance_schedules')
      .select(`
        *,
        equipments ( name )
      `)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Não foi possível buscar os agendamentos.');
    }
    return data;
  } catch (error) {
    console.error('Unexpected Error:', error);
    return [];
  }
}

export async function addMaintenance(formData: unknown) {
  const parsedData = maintenanceFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Dados do formulário inválidos.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('maintenance_schedules').insert([{
      ...parsedData.data,
      scheduled_date: parsedData.data.scheduled_date.toISOString(),
    }]);

    if (error) {
      return { success: false, message: `Erro ao agendar manutenção: ${error.message}` };
    }

    revalidatePath('/manutencao');
    return { success: true, message: 'Manutenção agendada com sucesso!' };
  } catch (error) {
    return { success: false, message: 'Ocorreu um erro inesperado.' };
  }
}
