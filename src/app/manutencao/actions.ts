'use server';

import { getGraphQLServerClient } from '@/lib/graphql/server';
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
    const client = getGraphQLServerClient();
    const query = /* GraphQL */ `
      query GetEquipments {
        equipments(order_by: { created_at: desc }) {
          id
          name
          category
          location
          brand
          model
          serial_number
          installation_date
          status
          created_at
        }
      }
    `;
    const res = await client.request(query);
    return (res?.equipments ?? []) as Equipment[];
  } catch (error) {
    console.error('Unexpected Error getEquipments (GraphQL):', error);
    return [];
  }
}

export async function addEquipment(formData: unknown) {
  const parsedData = equipmentFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Dados do formulário inválidos.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    const client = getGraphQLServerClient();
    const mutation = /* GraphQL */ `
      mutation InsertEquipment($object: equipments_insert_input!) {
        insert_equipments_one(object: $object) { id }
      }
    `;
    const installation_date = parsedData.data.installation_date
      ? parsedData.data.installation_date.toISOString().split('T')[0]
      : null;
    const object = {
      ...parsedData.data,
      installation_date,
    };
    await client.request(mutation, { object });

    revalidatePath('/manutencao');
    return { success: true, message: 'Equipamento cadastrado com sucesso!' };
  } catch (error: any) {
    return { success: false, message: `Erro ao cadastrar equipamento: ${error?.message || 'Erro inesperado.'}` };
  }
}

// --- Maintenance Actions ---

export async function getMaintenances(): Promise<Maintenance[]> {
  try {
    const client = getGraphQLServerClient();
    const query = /* GraphQL */ `
      query GetMaintenances {
        maintenance_schedules(order_by: { scheduled_date: desc }) {
          id
          equipment_id
          type
          priority
          description
          scheduled_date
          responsible
          cost
          status
          created_at
          equipments { name }
        }
      }
    `;
    const res = await client.request(query);
    return (res?.maintenance_schedules ?? []) as Maintenance[];
  } catch (error) {
    console.error('Unexpected Error getMaintenances (GraphQL):', error);
    return [];
  }
}

export async function addMaintenance(formData: unknown) {
  const parsedData = maintenanceFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Dados do formulário inválidos.', errors: parsedData.error.flatten().fieldErrors };
  }

  try {
    const client = getGraphQLServerClient();
    const mutation = /* GraphQL */ `
      mutation InsertMaintenance($object: maintenance_schedules_insert_input!) {
        insert_maintenance_schedules_one(object: $object) { id }
      }
    `;
    const scheduled_date = parsedData.data.scheduled_date
      ? parsedData.data.scheduled_date.toISOString().split('T')[0]
      : null;
    const object = {
      ...parsedData.data,
      scheduled_date,
    };

    await client.request(mutation, { object });

    revalidatePath('/manutencao');
    return { success: true, message: 'Manutenção agendada com sucesso!' };
  } catch (error: any) {
    return { success: false, message: `Erro ao agendar manutenção: ${error?.message || 'Erro inesperado.'}` };
  }
}
