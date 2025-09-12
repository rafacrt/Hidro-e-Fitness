
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecebimentosStatCards from "@/components/financeiro/recebimentos-stat-cards";
import RecebimentosFilters from "@/components/financeiro/recebimentos-filters";
import RecebimentosTable from "@/components/financeiro/recebimentos-table";
import RecebimentosBatchActions from "@/components/financeiro/recebimentos-batch-actions";
import type { Database } from "@/lib/database.types";
import { getTransactions } from '@/app/financeiro/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { AddPaymentForm } from '../pagamentos/add-payment-form';
import { Button } from '../ui/button';

type Payment = Database['public']['Tables']['payments']['Row'];

export default function ControlePagamentosTab() {
    const [recebimentos, setRecebimentos] = React.useState<Payment[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const refreshData = React.useCallback(async () => {
        setLoading(true);
        try {
            const freshData = await getTransactions('receita');
            setRecebimentos(freshData);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar dados',
                description: 'Não foi possível buscar as transações mais recentes.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        refreshData();
    }, [refreshData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <RecebimentosStatCards recebimentos={recebimentos} />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Histórico de Recebimentos</CardTitle>
                    <AddPaymentForm onSuccess={refreshData}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Novo Pagamento
                        </Button>
                    </AddPaymentForm>
                </CardHeader>
                <RecebimentosFilters />
                <CardContent className="p-0">
                    <RecebimentosTable recebimentos={recebimentos} onSuccess={refreshData} />
                </CardContent>
                <RecebimentosBatchActions />
            </Card>
        </div>
    )
}
