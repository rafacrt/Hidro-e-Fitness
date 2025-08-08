
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle, Copy } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Payment = Database['public']['Tables']['payments']['Row'];
type Student = Database['public']['Tables']['students']['Row'];

interface CobrancasPendentesProps {
  payments: Payment[];
  students: Student[];
}

const formatCurrency = (value: number | null) => {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};


export default function CobrancasPendentes({ payments, students }: CobrancasPendentesProps) {
  const pendingCharges = payments
    .filter(p => p.status === 'pendente' || p.status === 'vencido')
    .slice(0, 3);
  
  const getStudentName = (studentId: string | null) => {
    if (!studentId) return 'Aluno não identificado';
    return students.find(s => s.id === studentId)?.name || 'Aluno não encontrado';
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <CardTitle>Cobranças Pendentes</CardTitle>
            <Badge variant="destructive">{pendingCharges.length}</Badge>
        </div>
        <Button variant="ghost" size="icon">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pendingCharges.length > 0 ? pendingCharges.map((charge, index) => (
          <div key={index} className="p-4 rounded-lg border bg-card shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold">{getStudentName(charge.student_id)}</p>
                    <p className="text-sm text-muted-foreground">{charge.description}</p>
                </div>
                {charge.status === 'vencido' && (
                    <Badge variant="outline" className='bg-red-100 text-red-800 border-red-200'>Vencido</Badge>
                )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>Vencimento: {format(new Date(charge.due_date), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold">{formatCurrency(charge.amount)}</p>
                <div className='flex gap-2'>
                    <Button size="sm" variant="outline">Cobrar Agora</Button>
                    <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </div>
        )) : (
          <div className="col-span-1 md:col-span-3 text-center text-muted-foreground py-10">
            <AlertCircle className="mx-auto h-12 w-12 mb-4" />
            <p>Nenhuma cobrança pendente no momento.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
