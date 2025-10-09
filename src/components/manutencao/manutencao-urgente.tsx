'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle } from 'lucide-react';
import { getMaintenances } from '@/app/manutencao/actions';
import { format } from 'date-fns';
import type { Database } from '@/lib/database.types';

type Equipment = Database['public']['Tables']['equipments']['Row'];
type Maintenance = Database['public']['Tables']['maintenance_schedules']['Row'] & { equipments: Pick<Equipment, 'name'> | null };

const priorityStyles: { [key: string]: string } = {
  urgente: 'bg-red-100 text-red-800 border-red-200',
  alta: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  media: 'bg-orange-100 text-orange-800 border-orange-200',
  baixa: 'bg-blue-100 text-blue-800 border-blue-200',
};

export default function ManutencaoUrgente() {
  const [maintenances, setMaintenances] = React.useState<Maintenance[]>([]);

  React.useEffect(() => {
    async function loadMaintenances() {
      const data = await getMaintenances();
      // Filtrar apenas urgentes/alta prioridade e pendentes, ordenar por data
      const urgent = data
        .filter(m => (m.priority === 'urgente' || m.priority === 'alta') && m.status === 'agendada')
        .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
        .slice(0, 3);
      setMaintenances(urgent);
    }
    loadMaintenances();
  }, []);

  if (maintenances.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manutenções Urgentes</CardTitle>
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma manutenção urgente agendada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manutenções Urgentes</CardTitle>
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        {maintenances.map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-secondary/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{item.equipments?.name || 'Equipamento'}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Badge variant="outline" className={priorityStyles[item.priority] || priorityStyles.baixa}>
                {item.priority?.charAt(0).toUpperCase() + item.priority?.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span>{format(new Date(item.scheduled_date), 'dd/MM/yyyy')}</span>
                    <span className="mx-2">•</span>
                    <span>{item.type?.charAt(0).toUpperCase() + item.type?.slice(1)}</span>
                </div>
                {item.cost && <p className="font-semibold">R$ {item.cost.toFixed(2)}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
