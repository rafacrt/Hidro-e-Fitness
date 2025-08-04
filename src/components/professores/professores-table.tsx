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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '../ui/card';
import { Edit, Mail, MessageSquare, Phone, Trash2, MoreHorizontal, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/database.types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EditProfessorForm } from './edit-professor-form';
import { DeleteProfessorAlert } from './delete-professor-alert';

type Instructor = Database['public']['Tables']['instructors']['Row'];

interface ProfessoresTableProps {
  instructors: Instructor[];
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
}

const formatPhone = (phone: string | null) => {
    if (!phone) return '';
    if (phone.length === 11) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (phone.length === 10) {
        return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

const statusStyles: { [key: string]: string } = {
  Ativo: 'bg-green-100 text-green-800 border-green-200',
  Inativo: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function ProfessoresTable({ instructors }: ProfessoresTableProps) {
  if (instructors.length === 0) {
    return (
        <Card>
            <div className="p-6 text-center text-muted-foreground">
                <Dumbbell className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">Nenhum professor encontrado</h3>
                <p className="text-sm">Cadastre um novo professor para começar.</p>
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
              <TableHead>Professor</TableHead>
              <TableHead className="hidden md:table-cell">Contato</TableHead>
              <TableHead className="hidden lg:table-cell">Especialidades</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructors.map((prof) => (
              <TableRow key={prof.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(prof.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{prof.name}</p>
                       <div className="md:hidden mt-1 flex flex-wrap gap-1">
                          {(prof.specialties as string[])?.slice(0, 2).map(spec => (
                              <Badge key={spec} variant="secondary" className="font-normal text-xs">{spec}</Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{prof.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{formatPhone(prof.phone)}</span>
                        </div>
                         <div className="flex items-center gap-2 text-green-600">
                            <MessageSquare className="h-4 w-4" />
                            <span>WhatsApp</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(prof.specialties as string[])?.map(spec => (
                      <Badge key={spec} variant="secondary" className="font-normal">{spec}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', statusStyles['Ativo'])}>
                    Ativo
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
                            <EditProfessorForm instructor={prof}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                            </EditProfessorForm>
                             <DeleteProfessorAlert instructorId={prof.id}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </DropdownMenuItem>
                            </DeleteProfessorAlert>
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
