
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Pencil,
  Trash2,
  Users,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';
import { EditStudentForm } from './edit-student-form';
import { DeleteStudentAlert } from './delete-student-alert';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { StudentDetailsDialog } from './student-details-dialog';


type Student = Database['public']['Tables']['students']['Row'];

interface StudentsTableProps {
  students: Student[];
  onActionSuccess: () => void;
}

const getInitials = (name: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2).toUpperCase();
};

const formatCPF = (cpf: string | null) => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

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

const calculateAge = (birthDate: string | null): { age: number, isMinor: boolean } | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return { age, isMinor: age < 18 };
};

const statusStyles: { [key: string]: string } = {
  ativo: 'bg-green-100 text-green-800 border-green-200',
  inativo: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

const SortableHeader = ({
  children,
  sortKey,
}: {
  children: React.ReactNode;
  sortKey: keyof Student;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort');
  const currentOrder = searchParams.get('order');

  const isSorted = currentSort === sortKey;
  const newOrder = isSorted && currentOrder === 'asc' ? 'desc' : 'asc';

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortKey);
    params.set('order', newOrder);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Button variant="ghost" onClick={handleSort} className="px-0 hover:bg-transparent">
      {children}
      {isSorted && (
        currentOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

export default function StudentsTable({ students, onActionSuccess }: StudentsTableProps) {
  if (students.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center text-muted-foreground">
          <Users className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold">Nenhum aluno encontrado</h3>
          <p className="text-sm">Tente ajustar seus filtros ou cadastre um novo aluno.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortableHeader sortKey="name">Aluno</SortableHeader></TableHead>
              <TableHead className="hidden md:table-cell">Contato</TableHead>
              <TableHead className="hidden md:table-cell"><SortableHeader sortKey="birth_date">Idade</SortableHeader></TableHead>
              <TableHead><SortableHeader sortKey="status">Status</SortableHeader></TableHead>
              <TableHead className="hidden lg:table-cell"><SortableHeader sortKey="created_at">Matrícula</SortableHeader></TableHead>
              <TableHead className="hidden md:table-cell">Responsável</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const ageInfo = calculateAge(student.birth_date);
              return (
                <StudentDetailsDialog student={student} key={student.id} onSuccess={onActionSuccess}>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden">
                            {student.email || formatPhone(student.phone)}
                          </p>
                          <p className="text-sm text-muted-foreground">CPF: {formatCPF(student.cpf)}</p>
                          {student.medical_observations && (
                            <div className="flex items-center text-yellow-600 text-xs mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Observações médicas
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{formatPhone(student.phone)}</span>
                        </div>
                        {student.is_whatsapp && (
                          <div className="flex items-center gap-2 text-green-600">
                            <MessageSquare className="h-4 w-4" />
                            <span>WhatsApp</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {ageInfo && (
                        <div className="flex flex-col">
                          <span>{ageInfo.age} anos</span>
                          {ageInfo.isMinor && (
                            <Badge variant="outline" className="mt-1 font-normal bg-yellow-100 text-yellow-800 border-yellow-200 w-fit">
                                Menor de idade
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('font-medium capitalize', statusStyles[student.status || 'inativo'])}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(student.created_at), 'dd/MM/yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {ageInfo?.isMinor ? (
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">{student.responsible_name}</p>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{formatPhone(student.responsible_phone)}</span>
                            </div>
                          </div>
                      ) : (
                          <span className="text-muted-foreground">Maior de idade</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <EditStudentForm student={student} onSuccess={onActionSuccess}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                </EditStudentForm>
                                <DeleteStudentAlert studentId={student.id}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500" onClick={(e) => e.stopPropagation()}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                    </DropdownMenuItem>
                                </DeleteStudentAlert>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </StudentDetailsDialog>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
