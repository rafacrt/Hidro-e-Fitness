
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PagamentosStatCards from "./pagamentos-stat-cards";
import PagamentosFilters from "./pagamentos-filters";
import PagamentosTable from "./pagamentos-table";
import PagamentosBatchActions from "./pagamentos-batch-actions";
import type { Database } from "@/lib/database.types";
import { getTransactions } from '@/app/financeiro/actions';
import { useToast } from '@/hooks/use-toast';

type Payment = Database['public']['Tables']['payments']['Row'];

interface PagamentosTabProps {
    pagamentos: Payment[];
}

export default function PagamentosTab({ pagamentos: initialPagamentos }: PagamentosTabProps) {
    const [selectedPayments, setSelectedPayments] = React.useState<string[]>([]);
    const [pagamentos, setPagamentos] = React.useState<Payment[]>(initialPagamentos);
    const { toast } = useToast();

    const refreshData = async () => {
        try {
            const freshData = await getTransactions('despesa');
            setPagamentos(freshData);
            setSelectedPayments([]); // Limpa a seleção após a ação
        } catch (error) {
            toast({
                title: 'Erro ao atualizar dados',
                description: 'Não foi possível buscar as transações mais recentes.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <PagamentosStatCards pagamentos={pagamentos} />
            <Card>
                <PagamentosFilters />
                <CardContent className="p-0">
                    <PagamentosTable 
                        pagamentos={pagamentos} 
                        selectedPayments={selectedPayments}
                        setSelectedPayments={setSelectedPayments}
                    />
                </CardContent>
                <PagamentosBatchActions 
                    selectedPayments={selectedPayments}
                    onSuccess={refreshData}
                />
            </Card>
        </div>
    )
}
