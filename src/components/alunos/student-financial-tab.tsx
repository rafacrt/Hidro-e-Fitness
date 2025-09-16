
'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DollarSign, CheckCircle } from 'lucide-react';
import { getStudentPlans } from '@/app/modalidades/actions';
import type { Database } from '@/lib/database.types';
import { ManageStudentPlansDialog } from './manage-student-plans-dialog';

type Plan = Database['public']['Tables']['plans']['Row'] & { modalities: { name: string } | null };

interface StudentFinancialTabProps {
  studentId: string;
}

const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
};

export default function StudentFinancialTab({ studentId }: StudentFinancialTabProps) {
  const [loading, setLoading] = React.useState(true);
  const [plans, setPlans] = React.useState<Plan[]>([]);

  const loadPlans = React.useCallback(async () => {
    setLoading(true);
    const studentPlans = await getStudentPlans(studentId);
    setPlans(studentPlans as Plan[]);
    setLoading(false);
  }, [studentId]);

  React.useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="py-4 max-h-[60vh] overflow-y-auto pr-2 space-y-6">
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Planos e Assinaturas</CardTitle>
                    <CardDescription>Planos que o aluno está atualmente vinculado.</CardDescription>
                </div>
                <ManageStudentPlansDialog studentId={studentId} onSucceess={loadPlans}>
                    <Button>Gerenciar Planos</Button>
                </ManageStudentPlansDialog>
            </CardHeader>
            <CardContent>
                {plans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <DollarSign className="h-10 w-10 mb-4" />
                        <p className="font-semibold">Nenhum plano ativo</p>
                        <p className="text-sm">Vincule o aluno a um plano para gerar cobranças recorrentes.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {plans.map(plan => (
                            <div key={plan.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{plan.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{plan.modalities?.name} - {plan.recurrence}</p>
                                </div>
                                <p className="font-bold text-lg">{formatCurrency(plan.price)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Histórico de Cobranças</CardTitle>
                <CardDescription>Todas as cobranças geradas para este aluno.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="text-center text-muted-foreground p-8">
                    <p>Nenhuma cobrança encontrada.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
