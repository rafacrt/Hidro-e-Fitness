
'use client';

import * as React from 'react';
import { Loader2, Tags } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { Database } from '@/lib/database.types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ManageStudentPlansDialog } from './manage-student-plans-dialog';
import { getStudentPlans } from '@/app/alunos/actions';
import { getPlans } from '@/app/modalidades/actions';
import { useToast } from '@/hooks/use-toast';

type Plan = Database['public']['Tables']['plans']['Row'];

interface StudentPlansTabProps {
  studentId: string;
  onSuccess: () => void;
}

const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
};

const recurrenceMap = {
    mensal: { text: "por mês", badge: "Mensal" },
    bimestral: { text: "a cada 2 meses", badge: "Bimestral" },
    trimestral: { text: "a cada 3 meses", badge: "Trimestral" },
    semestral: { text: "a cada 6 meses", badge: "Semestral" },
    anual: { text: "por ano", badge: "Anual" },
};

export default function StudentPlansTab({ studentId, onSuccess }: StudentPlansTabProps) {
  const [loading, setLoading] = React.useState(true);
  const [allPlans, setAllPlans] = React.useState<Plan[]>([]);
  const [studentPlanIds, setStudentPlanIds] = React.useState<string[]>([]);
  const { toast } = useToast();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [plansData, studentPlansData] = await Promise.all([
        getPlans(),
        getStudentPlans(studentId),
      ]);
      setAllPlans(plansData as Plan[]);
      setStudentPlanIds(studentPlansData);
    } catch (err) {
      toast({ title: 'Erro ao carregar planos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [studentId, toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);
  
  const studentPlans = allPlans.filter(p => studentPlanIds.includes(p.id));

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
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Planos Contratados</CardTitle>
                    <CardDescription>Planos ativos vinculados a este aluno.</CardDescription>
                </div>
                 <ManageStudentPlansDialog studentId={studentId} onSuccess={() => {
                    loadData();
                    onSuccess();
                 }}>
                    <Button>Gerenciar Planos</Button>
                </ManageStudentPlansDialog>
            </CardHeader>
            <CardContent>
                {studentPlans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <Tags className="h-10 w-10 mb-2" />
                        <p className="font-semibold">Nenhum plano contratado</p>
                        <p className="text-sm">Vincule um plano para este aluno.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {studentPlans.map(plan => {
                            const recurrenceInfo = recurrenceMap[plan.recurrence as keyof typeof recurrenceMap] || { text: '', badge: '' };
                            return (
                                <div key={plan.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{plan.name}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{recurrenceInfo.badge}</Badge>
                                            <Badge variant={plan.status === 'ativo' ? 'default' : 'destructive'} className={plan.status === 'ativo' ? 'bg-green-600' : ''}>
                                                {plan.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                      <p className="font-bold text-lg">{formatCurrency(plan.price)}</p>
                                      <p className="text-sm text-muted-foreground capitalize">
                                        {recurrenceInfo.text}
                                      </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
