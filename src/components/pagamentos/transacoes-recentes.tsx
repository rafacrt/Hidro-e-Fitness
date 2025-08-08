
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import type { Database } from '@/lib/database.types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Payment = Database['public']['Tables']['payments']['Row'];
type Student = Database['public']['Tables']['students']['Row'];

interface TransacoesRecentesProps {
  payments: Payment[];
  students: Student[];
}

const statusStyles: { [key: string]: string } = {
  pago: 'bg-green-100 text-green-800 border-green-200',
  pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  vencido: 'bg-red-100 text-red-800 border-red-200',
};

const formatCurrency = (value: number | null) => {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function TransacoesRecentes({ payments, students }: TransacoesRecentesProps) {
  const recentTransactions = payments.slice(0, 4);
  
  const getStudentName = (studentId: string | null) => {
    if (!studentId) return 'N/A';
    return students.find(s => s.id === studentId)?.name || 'Aluno não encontrado';
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações Recentes</CardTitle>
        <Button variant="link" className="text-sm">Ver todas</Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentTransactions.length > 0 ? recentTransactions.map((transaction, index) => (
            <li key={index}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{getStudentName(transaction.student_id)}</p>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true, locale: ptBR })} · {transaction.payment_method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                  <Badge variant="outline" className={cn('mt-1 font-medium capitalize', statusStyles[transaction.status])}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </li>
          )) : (
             <li className="text-center text-muted-foreground py-10">
                <p>Nenhuma transação recente.</p>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
