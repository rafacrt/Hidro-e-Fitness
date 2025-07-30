
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Check, X, Edit, Trash2, User, Wrench } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Equipment = Database['public']['Tables']['equipments']['Row'];
type Maintenance = Database['public']['Tables']['maintenance_schedules']['Row'] & { equipments: Pick<Equipment, 'name'> | null };

interface AgendamentosTableProps {
  maintenances: Maintenance[];
}

const statusConfig = {
    agendada: { text: 'Agendada', class: 'bg-blue-100 text-blue-800 border-blue-200' },
    em_andamento: { text: 'Em Andamento', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    concluida: { text: 'Concluída', class: 'bg-green-100 text-green-800 border-green-200' },
    cancelada: { text: 'Cancelada', class: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
};

const priorityConfig = {
    baixa: { text: 'Baixa', class: 'bg-gray-100 text-gray-800 border-gray-200' },
    media: { text: 'Média', class: 'bg-orange-100 text-orange-800 border-orange-200' },
    alta: { text: 'Alta', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    urgente: { text: 'Urgente', class: 'bg-red-100 text-red-800 border-red-200' },
};

export default function AgendamentosTable({ maintenances }: AgendamentosTableProps) {
  if (maintenances.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Wrench className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold">Nenhum agendamento encontrado</h3>
        <p className="text-sm">Tente agendar uma nova manutenção.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipamento</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((item) => {
            const statusInfo = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.agendada;
            const priorityInfo = priorityConfig[item.priority as keyof typeof priorityConfig] || priorityConfig.baixa;
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium text-sm">{item.equipments?.name}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={cn("font-normal", priorityInfo.class)}>{priorityInfo.text}</Badge>
                      <Badge variant="outline" className="font-normal capitalize">{item.type}</Badge>
                   </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{item.description}</p>
                  {item.responsible && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{item.responsible}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{format(new Date(item.scheduled_date), 'dd/MM/yyyy')}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", statusInfo.class)}>
                     {statusInfo.text}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{item.cost ? `R$ ${item.cost.toFixed(2)}` : '-'}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
