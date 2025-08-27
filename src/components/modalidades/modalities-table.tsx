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
import { Eye, Edit, Trash2, Users, Clock, Dumbbell } from 'lucide-react';
import { Card } from '../ui/card';
import { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import type { Database } from '@/lib/database.types';
import { DeleteModalityAlert } from './delete-modality-alert';
import { EditModalityForm } from './edit-modality-form';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

type Modality = Database['public']['Tables']['modalities']['Row'];

interface ModalitiesTableProps {
  modalities: Modality[];
  onSuccess: () => void;
}

export default function ModalitiesTable({ modalities, onSuccess }: ModalitiesTableProps) {
  
  if (modalities.length === 0) {
    return (
        <Card>
            <div className="p-6 text-center text-muted-foreground">
                <Dumbbell className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">Nenhuma modalidade encontrada</h3>
                <p className="text-sm">Cadastre uma nova modalidade para começar.</p>
            </div>
        </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"><Checkbox /></TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modalities.map((mod) => (
              <TableRow key={mod.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500")}>
                      <Dumbbell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{mod.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{mod.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <EditModalityForm modality={mod} onSuccess={onSuccess}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                            </EditModalityForm>
                            <DeleteModalityAlert modalityId={mod.id} onSuccess={onSuccess}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </DropdownMenuItem>
                            </DeleteModalityAlert>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
