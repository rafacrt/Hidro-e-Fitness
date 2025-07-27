
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
import { Calendar, Check, X, Edit, Trash2, User } from 'lucide-react';

const maintenances = [
  {
    title: 'Manutenção Preventiva - Bomba Principal',
    description: 'Troca de filtros, verificação do motor e lubrificação',
    priority: 'Alta',
    priorityClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    equipment: 'Bomba Principal Piscina 1',
    location: 'Casa de Máquinas A',
    type: 'Preventiva',
    date: '17/01/2024',
    time: '08:00 (120min)',
    technician: 'João Silva',
    status: 'Agendada',
    statusClass: 'bg-blue-100 text-blue-800 border-blue-200',
    cost: 'R$ 450,00',
  },
  {
    title: 'Reparo Emergencial - Aquecedor',
    description: 'Reparo no trocador de calor com vazamento',
    priority: 'Urgente',
    priorityClass: 'bg-red-100 text-red-800 border-red-200',
    equipment: 'Aquecedor Solar Piscina 2',
    location: 'Cobertura',
    type: 'Emergencial',
    date: '15/01/2024',
    time: '14:00 (240min)',
    technician: 'Carlos Santos',
    status: 'Em Andamento',
    statusClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cost: 'R$ 1200,00',
  },
  {
    title: 'Substituição de Lâmpadas LED',
    description: 'Substituição de 2 lâmpadas LED queimadas',
    priority: 'Média',
    priorityClass: 'bg-orange-100 text-orange-800 border-orange-200',
    equipment: 'Sistema LED Piscina 1',
    location: 'Piscina 1',
    type: 'Preventiva',
    date: '19/01/2024',
    time: '10:00 (90min)',
    technician: 'Ana Costa',
    status: 'Agendada',
    statusClass: 'bg-blue-100 text-blue-800 border-blue-200',
    cost: 'R$ 320,00',
  },
  {
    title: 'Limpeza do Filtro de Areia',
    description: 'Retrolavagem e limpeza do filtro',
    priority: 'Média',
    priorityClass: 'bg-orange-100 text-orange-800 border-orange-200',
    equipment: 'Filtro de Areia Principal',
    location: 'Casa de Máquinas A',
    type: 'Preventiva',
    date: '11/01/2024',
    time: '09:00 (60min)',
    technician: 'Roberto Lima',
    status: 'Concluída',
    statusClass: 'bg-green-100 text-green-800 border-green-200',
    cost: 'R$ 0,00',
  },
  {
    title: 'Calibração do Controlador de pH',
    description: 'Substituição do sensor de pH danificado',
    priority: 'Alta',
    priorityClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    equipment: 'Controlador de pH Automático',
    location: 'Casa de Máquinas B',
    type: 'Corretiva',
    date: '14/01/2024',
    time: '16:00 (180min)',
    technician: 'João Silva',
    status: 'Cancelada',
    statusClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    cost: 'R$ 800,00',
  },
];

export default function AgendamentosTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Manutenção</TableHead>
            <TableHead>Equipamento</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Técnico</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <Badge variant="outline" className={cn("mt-1 font-normal", item.priorityClass)}>{item.priority}</Badge>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.equipment}</p>
                <p className="text-xs text-muted-foreground">{item.location}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm">{item.type}</p>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.date}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className='text-sm'>{item.technician}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-medium", item.statusClass)}>
                   {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{item.cost}</p>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
