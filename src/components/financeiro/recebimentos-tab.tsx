
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import RecebimentosStatCards from "./recebimentos-stat-cards";
import RecebimentosFilters from "./recebimentos-filters";
import RecebimentosTable from "./recebimentos-table";
import RecebimentosBatchActions from "./recebimentos-batch-actions";
import type { Database } from "@/lib/database.types";
import { getTransactions } from '@/app/financeiro/actions';
import { useToast } from '@/hooks/use-toast';

type Payment = Database['public']['Tables']['payments']['Row'];

interface RecebimentosTabProps {
    recebimentos: Payment[];
}

export default function RecebimentosTab({ recebimentos: initialRecebimentos }: RecebimentosTabProps) {
    const [recebimentos, setRecebimentos] = React.useState(initialRecebimentos);
    const { toast } = useToast();

    const refreshData = async () => {
        try {
            const freshData = await getTransactions('receita');
            setRecebimentos(freshData);
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
            <RecebimentosStatCards recebimentos={recebimentos} />
            <Card>
                <RecebimentosFilters />
                <CardContent className="p-0">
                    <RecebimentosTable recebimentos={recebimentos} onSuccess={refreshData} />
                </CardContent>
                <RecebimentosBatchActions />
            </Card>
        </div>
    )
}

    