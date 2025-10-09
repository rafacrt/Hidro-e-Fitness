
'use client';
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
import {
  AlertTriangle,
  Mail,
  Phone,
  MessageSquare,
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
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const itemsPerPage = 20;

  // Calcular paginação
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = students.slice(startIndex, endIndex);

  // Reset para página 1 quando mudar os filtros/busca
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  // Função para forçar refresh dos planos
  const handleRefresh = React.useCallback(() => {
    setRefreshKey(prev => prev + 1);
    onActionSuccess();
  }, [onActionSuccess]);

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
              <TableHead className="hidden lg:table-cell">Planos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStudents.map((student) => {
              const ageInfo = calculateAge(student.birth_date);
              return (
                <StudentDetailsDialog student={student} key={student.id} onSuccess={handleRefresh}>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">
                          {student.email || formatPhone(student.phone)}
                        </p>
                        {student.medical_observations && (
                          <div className="flex items-center text-yellow-600 text-xs mt-1">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Observações médicas
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {student.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{student.email}</span>
                          </div>
                        )}
                        {student.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{formatPhone(student.phone)}</span>
                          </div>
                        )}
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
                        <div className="flex flex-col gap-1">
                          <span>{ageInfo.age} anos</span>
                          {ageInfo.isMinor && (
                            <Badge variant="secondary" className="h-5 px-2 text-xs font-medium bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 w-fit">
                              <Users className="w-3 h-3 mr-1" />
                              Menor
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
                      <StudentPlansCell studentId={student.id} key={`${student.id}-${refreshKey}`} />
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, students.length)} de {students.length} alunos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Mostrar primeira, última, atual, e páginas próximas
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  // Adicionar "..." entre números não consecutivos
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-9"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function StudentPlansCell({ studentId }: { studentId: string | number }) {
  const [plans, setPlans] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPlans() {
      const { getStudentPlans } = await import('@/app/alunos/actions');
      const planIds = await getStudentPlans(String(studentId));

      if (planIds.length > 0) {
        const { getPlans } = await import('@/app/modalidades/actions');
        const { data } = await getPlans();
        const studentPlans = data?.filter(p => planIds.includes(p.id)) || [];
        setPlans(studentPlans);
      }
      setLoading(false);
    }
    loadPlans();
  }, [studentId]);

  if (loading) {
    return <span className="text-xs text-muted-foreground">Carregando...</span>;
  }

  if (plans.length === 0) {
    return <span className="text-xs text-muted-foreground">Sem plano</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {plans.slice(0, 2).map((plan) => (
        <Badge key={plan.id} variant="outline" className="text-xs">
          {plan.name}
        </Badge>
      ))}
      {plans.length > 2 && (
        <Badge variant="outline" className="text-xs">
          +{plans.length - 2}
        </Badge>
      )}
    </div>
  );
}
