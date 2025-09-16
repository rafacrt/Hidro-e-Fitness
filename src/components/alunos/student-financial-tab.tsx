
'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DollarSign } from 'lucide-react';

interface StudentFinancialTabProps {
  studentId: string;
}

export default function StudentFinancialTab({ studentId }: StudentFinancialTabProps) {
  const [loading, setLoading] = React.useState(true);

  // Simulate fetching financial data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [studentId]);

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
            <CardHeader>
                <CardTitle>Planos e Assinaturas</CardTitle>
                <CardDescription>Planos que o aluno está atualmente vinculado.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                     <DollarSign className="h-10 w-10 mb-4" />
                    <p className="font-semibold">Nenhum plano ativo</p>
                    <p className="text-sm">Vincule o aluno a um plano para gerar cobranças recorrentes.</p>
                    <Button className="mt-4">Gerenciar Planos</Button>
                </div>
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
