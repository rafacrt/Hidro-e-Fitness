'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Student = Database['public']['Tables']['students']['Row'];

interface StudentProfileModalProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentProfileModal({
  student,
  open,
  onOpenChange,
}: StudentProfileModalProps) {
  const handlePrint = () => {
    window.print();
  };

  if (!student) return null;

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return '-';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }
    return cpf;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto print:max-w-full print:max-h-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Ficha do Aluno</DialogTitle>
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="absolute right-14 top-4"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </DialogHeader>

        <div id="student-profile-print" className="space-y-3 p-2 print:p-4 print:text-sm">
          {/* Cabeçalho para impressão */}
          <div className="hidden print:block text-center mb-3">
            <h1 className="text-xl font-bold">Ficha do Aluno</h1>
            <p className="text-xs text-gray-600">Hidro Fitness</p>
          </div>

          {/* Dados Pessoais */}
          <section className="bg-cyan-50 p-3 rounded-lg print:bg-white print:border print:border-cyan-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center print:hidden">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-cyan-900">{student.name}</h2>
                <p className="text-xs text-cyan-700">
                  Status: <span className="font-semibold capitalize">{student.status || 'ativo'}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-cyan-600 mt-0.5 print:hidden" />
                <div>
                  <p className="text-xs text-gray-600">CPF</p>
                  <p className="text-sm font-medium">{formatCPF(student.cpf)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-cyan-600 mt-0.5 print:hidden" />
                <div>
                  <p className="text-xs text-gray-600">Data de Nascimento</p>
                  <p className="text-sm font-medium">{formatDate(student.birth_date)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contato e Endereço em uma seção */}
          <section className="border rounded-lg p-3 print:border">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-cyan-600 print:hidden" />
                  Contato
                </h3>
                <div className="space-y-1">
                  <div>
                    <p className="text-xs text-gray-600">E-mail</p>
                    <p className="text-sm font-medium truncate">{student.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Telefone</p>
                    <p className="text-sm font-medium">
                      {formatPhone(student.phone)}
                      {student.is_whatsapp && <span className="text-xs text-green-600"> (WhatsApp)</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-cyan-600 print:hidden" />
                  Endereço
                </h3>
                <div className="space-y-1">
                  <p className="text-sm">{student.street || '-'}, {student.number || 'S/N'}</p>
                  {student.complement && <p className="text-xs text-gray-600">{student.complement}</p>}
                  <p className="text-sm">{student.neighborhood || '-'}</p>
                  <p className="text-sm">{student.city || '-'} - {student.state || '-'}</p>
                  <p className="text-xs text-gray-600">CEP: {student.cep || '-'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Responsável e Observações em uma seção */}
          {(student.responsible_name || student.responsible_phone || student.medical_observations) && (
            <section className="border rounded-lg p-3 print:border">
              <div className="grid grid-cols-2 gap-3">
                {(student.responsible_name || student.responsible_phone) && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <User className="w-4 h-4 text-cyan-600 print:hidden" />
                      Responsável
                    </h3>
                    <div className="space-y-1">
                      <div>
                        <p className="text-xs text-gray-600">Nome</p>
                        <p className="text-sm font-medium">{student.responsible_name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Telefone</p>
                        <p className="text-sm font-medium">{formatPhone(student.responsible_phone)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {student.medical_observations && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-yellow-900">
                      <FileText className="w-4 h-4 text-yellow-700 print:hidden" />
                      Observações Médicas
                    </h3>
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{student.medical_observations}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Rodapé para impressão */}
          <div className="hidden print:block text-center text-xs text-gray-500 mt-2 pt-2 border-t">
            <p>Impresso em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
