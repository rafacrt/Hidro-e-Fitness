
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
import { MapPin, Eye, Edit, Trash2, Wrench } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Equipment = Database['public']['Tables']['equipments']['Row'];

interface EquipamentosTableProps {
  equipments: Equipment[];
}

const statusConfig = {
    operacional: { text: 'Operacional', class: 'bg-green-100 text-green-800 border-green-200' },
    manutencao: { text: 'Manutenção', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    quebrado: { text: 'Quebrado', class: 'bg-red-100 text-red-800 border-red-200' },
};


export default function EquipamentosTable({ equipments }: EquipamentosTableProps) {
  if (equipments.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Wrench className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold">Nenhum equipamento encontrado</h3>
        <p className="text-sm">Tente adicionar um novo equipamento.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipamento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Instalação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipments.map((item) => {
             const statusInfo = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.operacional;
             return (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.brand} {item.model} | S/N: {item.serial_number}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{item.category}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className='text-sm'>{item.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", statusInfo.class)}>
                    {statusInfo.text}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{format(new Date(item.installation_date), 'dd/MM/yyyy')}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          )}
        </TableBody>
      </Table>
    </div>
  );
}
