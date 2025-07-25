'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

const students = [
  {
    name: 'Maria Silva Santos',
    cpf: '123.456.789-10',
    avatar: 'MS',
    medicalObs: true,
    email: 'maria.santos@email.com',
    phone: '(11) 99999-8888',
    whatsapp: true,
    age: '40 anos',
    isMinor: false,
    status: 'Ativo',
    matricula: '14/01/2023',
    responsavel: 'Maior de idade',
    responsavelPhone: '',
  },
  {
    name: 'João Pedro Costa',
    cpf: '987.654.321-00',
    avatar: 'JP',
    medicalObs: false,
    email: 'joao.costa@email.com',
    phone: '(11) 88888-7777',
    whatsapp: true,
    age: '15 anos',
    isMinor: true,
    status: 'Ativo',
    matricula: '19/02/2023',
    responsavel: 'Ana Costa',
    responsavelPhone: '(11) 77777-6666',
  },
  {
    name: 'Carlos Eduardo Lima',
    cpf: '456.789.123-45',
    avatar: 'CE',
    medicalObs: false,
    email: 'carlos.lima@email.com',
    phone: '(11) 66666-5555',
    whatsapp: false,
    age: '32 anos',
    isMinor: false,
    status: 'Inativo',
    matricula: '08/06/2022',
    responsavel: 'Maior de idade',
    responsavelPhone: '',
  },
  {
    name: 'Ana Clara Oliveira',
    cpf: '789.123.456-78',
    avatar: 'AC',
    medicalObs: true,
    email: 'ana.oliveira@email.com',
    phone: '(11) 55555-4444',
    whatsapp: true,
    age: '13 anos',
    isMinor: true,
    status: 'Ativo',
    matricula: '09/03/2023',
    responsavel: 'Roberto Oliveira',
    responsavelPhone: '(11) 44444-3333',
  },
];

const statusStyles: { [key: string]: string } = {
  Ativo: 'bg-green-100 text-green-800 border-green-200',
  Inativo: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function StudentsTable() {
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
          {students.map((student, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">CPF: {student.cpf}</p>
                    {student.medicalObs && (
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
                    <span>{student.phone}</span>
                  </div>
                  {student.whatsapp && (
                    <div className="flex items-center gap-2 text-green-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{student.age}</span>
                  {student.isMinor && (
                     <Badge variant="outline" className="mt-1 font-normal bg-yellow-100 text-yellow-800 border-yellow-200 w-fit">
                        Menor de idade
                     </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn('font-medium', statusStyles[student.status])}>
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{student.matricula}</span>
                </div>
              </TableCell>
              <TableCell>
                 {student.responsavel === 'Maior de idade' ? (
                    <span className="text-muted-foreground">{student.responsavel}</span>
                 ) : (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{student.responsavel}</p>
                      <div className="flex items-center gap-2">
                         <Phone className="h-4 w-4" />
                         <span>{student.responsavelPhone}</span>
                      </div>
                       <div className="flex items-center gap-2 text-green-600">
                          <MessageSquare className="h-4 w-4" />
                          <span>WhatsApp</span>
                       </div>
                    </div>
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
          ))}
        </TableBody>
      </Table>
      </div>
    </Card>
  );
}
