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
  Copy,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentsTableProps {
  students: Student[];
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

export default function StudentsTable({ students }: StudentsTableProps) {
  if (students.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center text-muted-foreground">
          <Users className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold">Nenhum aluno encontrado</h3>
          <p className="text-sm">Cadastre um novo aluno para começar a gerenciar.</p>
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
            <TableHead>Aluno</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const ageInfo = calculateAge(student.birth_date);
            return (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">{getInitials(student.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
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
                <TableCell>
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
                <TableCell>
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
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(student.created_at), 'dd/MM/yyyy')}</span>
                  </div>
                </TableCell>
                <TableCell>
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
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
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
    </Card>
  );
}
