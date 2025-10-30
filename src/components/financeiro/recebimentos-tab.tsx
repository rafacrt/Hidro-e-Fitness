'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RecebimentosTable from './recebimentos-table';
import type { Database } from '@/lib/database.types';
import { getPaymentsWithFilters, type PaymentsFilters } from '@/app/financeiro/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Filter } from 'lucide-react';
import { format } from 'date-fns';

type Payment = Database['public']['Tables']['payments']['Row'];

interface RecebimentosTabProps {
  recebimentos: Payment[];
}

export default function RecebimentosTab({ recebimentos: initialRecebimentos }: RecebimentosTabProps) {
  const [recebimentos, setRecebimentos] = React.useState(initialRecebimentos);
  const [loading, setLoading] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>('todos');
  const [monthFilter, setMonthFilter] = React.useState<string>(format(new Date(), 'yyyy-MM'));
  const { toast } = useToast();

  const loadData = React.useCallback(
    async (filters?: PaymentsFilters) => {
      setLoading(true);
      try {
        const freshData = await getPaymentsWithFilters(filters);
        setRecebimentos(freshData);
      } catch (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível buscar os recebimentos.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  React.useEffect(() => {
    loadData({ month: monthFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    const filters: PaymentsFilters = { month: monthFilter };

    if (statusFilter !== 'todos') {
      filters.status = statusFilter as PaymentsFilters['status'];
    }

    loadData(filters);
  };

  const handleClearFilters = () => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    setStatusFilter('todos');
    setMonthFilter(currentMonth);
    loadData({ month: currentMonth });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const stats = React.useMemo(() => {
    const total = recebimentos.reduce((sum, r) => sum + (r.amount || 0), 0);
    const paid = recebimentos.filter((r) => r.status === 'pago').reduce((sum, r) => sum + (r.amount || 0), 0);
    const pending = recebimentos.filter((r) => r.status === 'pendente').reduce((sum, r) => sum + (r.amount || 0), 0);
    const overdue = recebimentos
      .filter((r) => {
        if (r.status === 'pago') return false;
        if (!r.due_date) return false;
        const dueDate = new Date(r.due_date);
        return !Number.isNaN(dueDate.getTime()) && dueDate < new Date();
      })
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return {
      total,
      paid,
      pending,
      overdue,
      count: recebimentos.length,
    };
  }, [recebimentos]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-4">
            <p className="text-sm text-cyan-800 font-medium">Total</p>
            <p className="text-2xl font-bold text-cyan-900">{formatCurrency(stats.total)}</p>
            <p className="text-xs text-cyan-600">{stats.count} recebimentos</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-green-800 font-medium">Pago</p>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.paid)}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800 font-medium">Pendente</p>
            <p className="text-2xl font-bold text-yellow-900">{formatCurrency(stats.pending)}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-sm text-red-800 font-medium">Atrasado</p>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(stats.overdue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="vencido">Atrasado</SelectItem>
                  <SelectItem value="inadimplente">Inadimplente (+30 dias)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="month-filter">Mês/Ano</Label>
              <Input id="month-filter" type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilters} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" />
                    Aplicar Filtros
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClearFilters} disabled={loading}>
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <RecebimentosTable
              recebimentos={recebimentos}
              onSuccess={() =>
                loadData({
                  month: monthFilter,
                  status: statusFilter !== 'todos' ? (statusFilter as PaymentsFilters['status']) : undefined,
                })
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
