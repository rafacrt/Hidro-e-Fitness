
'use client';

import * as React from 'react';
import DicasConfiguracao from './dicas-configuracao';
import MetodosPagamentoList from './metodos-pagamento-list';
import MetodosPagamentoStats from './metodos-pagamento-stats';
import { getPaymentMethods, type PaymentMethod } from '@/app/pagamentos/actions';
import { Loader2 } from 'lucide-react';

export default function MetodosPagamentoTab() {
    const [methods, setMethods] = React.useState<PaymentMethod[]>([]);
    const [loading, setLoading] = React.useState(true);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        const dbMethods = await getPaymentMethods();
        setMethods(dbMethods);
        setLoading(false);
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <MetodosPagamentoStats />
            <MetodosPagamentoList methods={methods} />
            <DicasConfiguracao />
        </div>
    )
}
