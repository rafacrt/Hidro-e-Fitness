'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Database } from '@/lib/database.types';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

type Payment = Database['public']['Tables']['payments']['Row'];

interface FluxoDeCaixaChartDialogProps {
  children: React.ReactNode;
  transactions: Payment[];
}

const formatCurrencyForTooltip = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function FluxoDeCaixaChartDialog({ children, transactions }: FluxoDeCaixaChartDialogProps) {
  const [open, setOpen] = React.useState(false);

  const chartData = React.useMemo(() => {
    if (!transactions.length) return [];

    const firstDate = new Date(transactions[0].created_at);
    const startDate = startOfMonth(firstDate);
    const endDate = endOfMonth(firstDate);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    const dailyData = daysInMonth.map(day => ({
        date: format(day, 'dd/MM'),
        receita: 0,
        despesa: 0,
    }));

    transactions.forEach(t => {
      const dayIndex = new Date(t.created_at).getDate() - 1;
      if (dailyData[dayIndex]) {
        if ((t.amount || 0) > 0) {
          dailyData[dayIndex].receita += t.amount || 0;
        } else {
          dailyData[dayIndex].despesa += Math.abs(t.amount || 0);
        }
      }
    });

    return dailyData;
  }, [transactions]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gráfico de Fluxo de Caixa Mensal</DialogTitle>
          <DialogDescription>
            Visualização diária de receitas e despesas para o mês selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[400px] w-full py-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
              <Tooltip formatter={formatCurrencyForTooltip} />
              <Legend />
              <Bar dataKey="receita" fill="hsl(var(--primary))" name="Receita" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" fill="hsl(var(--destructive))" name="Despesa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
