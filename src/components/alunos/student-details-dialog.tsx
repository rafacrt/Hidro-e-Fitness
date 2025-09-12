
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Cake,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  HeartPulse,
  Pencil,
  FileText,
  ShieldAlert,
  History,
  BookUser,
} from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';
import { EditStudentForm } from './edit-student-form';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import StudentHistoryTimeline from './student-history-timeline';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentDetailsDialogProps {
  student: Student;
  children: React.ReactNode;
}

const getInitials = (name: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
};

const formatCPF = (cpf: string | null) => {
  if (!cpf) return 'Não informado';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone: string | null) => {
    if (!phone) return 'Não informado';
    if (phone.length === 11) return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (phone.length === 10) return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return phone;
}

const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
};

const statusStyles: { [key: string]: string } = {
  ativo: 'bg-green-100 text-green-800 border-green-200',
  inativo: 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Icon className="h-3 w-3" /> {label}</p>
    <p className="text-sm font-medium">{value || 'Não informado'}</p>
  </div>
);

export function StudentDetailsDialog({ student, children }: StudentDetailsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const age = calculateAge(student.birth_date);
  const isMinor = age !== null && age < 18;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-cyan-100 text-cyan-700 font-semibold">{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{student.name}</DialogTitle>
              <DialogDescription>
                Ficha de cadastro do aluno.
              </DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                 <Badge variant="outline" className={statusStyles[student.status || 'inativo']}>
                    {student.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
                {isMinor && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Menor de idade
                    </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="cadastro" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cadastro"><BookUser className="mr-2 h-4 w-4" />Dados Cadastrais</TabsTrigger>
            <TabsTrigger value="historico"><History className="mr-2 h-4 w-4" />Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="cadastro">
             <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Dados Pessoais */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-base">Dados Pessoais</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DetailItem icon={FileText} label="CPF" value={formatCPF(student.cpf)} />
                        <DetailItem icon={Cake} label="Nascimento" value={student.birth_date ? `${format(new Date(student.birth_date), 'dd/MM/yyyy')} (${age} anos)` : 'Não informada'} />
                    </div>
                </div>
                <Separator />
                {/* Contato */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-base">Contato</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DetailItem icon={Mail} label="E-mail" value={student.email} />
                        <div className='flex flex-col'>
                            <DetailItem icon={Phone} label="Telefone" value={formatPhone(student.phone)} />
                            {student.is_whatsapp && (
                              <div className="flex items-center gap-1.5 text-xs text-green-600 mt-1">
                                    <MessageSquare className="h-3 w-3" /> <span>É WhatsApp</span>
                              </div>
                            )}
                        </div>
                    </div>
                </div>
                <Separator />
                {/* Endereço */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-base">Endereço</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <DetailItem icon={MapPin} label="CEP" value={student.cep} />
                        <DetailItem icon={MapPin} label="Rua" value={`${student.street || ''}, ${student.number || ''}`} />
                        <DetailItem icon={MapPin} label="Complemento" value={student.complement} />
                        <DetailItem icon={MapPin} label="Bairro" value={student.neighborhood} />
                        <DetailItem icon={MapPin} label="Cidade/Estado" value={`${student.city || ''} - ${student.state || ''}`} />
                    </div>
                </div>

                {isMinor && (
                    <>
                        <Separator />
                        <div className="space-y-3 p-3 rounded-md bg-yellow-50 border border-yellow-200">
                            <h4 className="font-semibold text-base text-yellow-800 flex items-center gap-2"><ShieldAlert className="h-5 w-5" /> Dados do Responsável</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <DetailItem icon={User} label="Nome" value={student.responsible_name} />
                                <DetailItem icon={Phone} label="Telefone" value={formatPhone(student.responsible_phone)} />
                            </div>
                        </div>
                    </>
                )}

                {student.medical_observations && (
                    <>
                        <Separator />
                        <div className="space-y-2 p-3 rounded-md bg-red-50 border border-red-200">
                            <h4 className="font-semibold text-base text-red-800 flex items-center gap-2"><HeartPulse className="h-5 w-5" /> Observações Médicas</h4>
                            <p className="text-sm">{student.medical_observations}</p>
                        </div>
                    </>
                )}
            </div>
          </TabsContent>
          <TabsContent value="historico">
            <StudentHistoryTimeline studentId={student.id} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Fechar
                </Button>
            </DialogClose>
            <EditStudentForm student={student}>
                <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Aluno
                </Button>
            </EditStudentForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
