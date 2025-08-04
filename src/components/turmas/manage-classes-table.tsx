
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, MapPin, Edit, User, Trash2, MoreHorizontal, Users } from 'lucide-react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import type { Database } from '@/lib/database.types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DeleteClassAlert } from './delete-class-alert';
import { EditClassForm } from './edit-class-form';

type Instructor = Database['public']['Tables']['instructors']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type ClassRow = Database['public']['Tables']['classes']['Row'] & { instructors: Pick<Instructor, 'name'> | null } & { modalities: Pick<Modality, 'name'> | null };

interface ManageClassesTableProps {
  classes: ClassRow[];
}

const statusStyles: { [key: string]: string } = {
  ativa: 'bg-green-100 text-green-800 border-green-200',
  inativa: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  lotada: 'bg-red-100 text-red-800 border-red-200',
};

const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
}


export default function ManageClassesTable({ classes }: ManageClassesTableProps) {
  if (classes.length === 0) {
    return (
        <Card>
            <div className="p-6 text-center text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">Nenhuma turma encontrada</h3>
                <p className="text-sm">Cadastre uma nova turma para começar.</p>
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
              <TableHead>Turma</TableHead>
              <TableHead className="hidden md:table-cell">Professor</TableHead>
              <TableHead className="hidden lg:table-cell">Horários</TableHead>
              <TableHead>Ocupação</TableHead>
              <TableHead className="hidden md:table-cell">Local</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => {
                const occupancy = 0; // TODO: Calculate occupancy
                const occupancyRate = cls.max_students ? (occupancy / cls.max_students) * 100 : 0;
                
                return (
                    <TableRow key={cls.id}>
                        <TableCell>
                        <p className="font-medium">{cls.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="font-normal">{cls.modalities?.name || 'N/A'}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 md:hidden">
                           {cls.instructors?.name || 'N/A'}
                        </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{getInitials(cls.instructors?.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="font-medium text-sm">{cls.instructors?.name || 'N/A'}</p>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{cls.start_time} - {cls.end_time}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {cls.days_of_week.map(day => <Badge key={day} variant="outline" className="font-normal text-xs">{day}</Badge>)}
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{occupancy}/{cls.max_students}</span>
                            <span className="text-sm text-muted-foreground hidden lg:inline">({occupancyRate.toFixed(0)}%)</span>
                        </div>
                        <Progress value={occupancyRate} className="h-1.5 mt-1" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{cls.location}</span>
                        </div>
                        </TableCell>
                        <TableCell>
                        <Badge variant="outline" className={cn('font-medium capitalize', statusStyles[cls.status || 'inativa'])}>
                            {cls.status}
                        </Badge>
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
                                <EditClassForm classData={cls}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                </EditClassForm>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    Ver Alunos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DeleteClassAlert classId={cls.id}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                    </DropdownMenuItem>
                                </DeleteClassAlert>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
