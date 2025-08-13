
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, Calendar } from "lucide-react";
import { AddTransacaoDialog } from './add-transacao-dialog';
import { PagarSelecionadosAlert } from './pagar-selecionados-alert';
import { AgendarPagamentosDialog } from './agendar-pagamentos-dialog';
import type { Database } from '@/lib/database.types';

type Payment = Database['public']['Tables']['payments']['Row'];

interface PagamentosBatchActionsProps {
    selectedPayments: string[];
    onSuccess: () => void;
}

export default function PagamentosBatchActions({ selectedPayments, onSuccess }: PagamentosBatchActionsProps) {
    const hasSelection = selectedPayments.length > 0;

    return (
        <div className="p-4 border-t">
            <h3 className="text-sm font-semibold mb-2">Ações em Lote</h3>
            <div className="flex flex-wrap gap-2">
                <AddTransacaoDialog>
                    <Button variant="default">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Despesa
                    </Button>
                </AddTransacaoDialog>
                <PagarSelecionadosAlert
                    paymentIds={selectedPayments}
                    onSuccess={onSuccess}
                    disabled={!hasSelection}
                >
                    <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white" disabled={!hasSelection}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Pagar Selecionados
                    </Button>
                </PagarSelecionadosAlert>
                 <AgendarPagamentosDialog
                    paymentIds={selectedPayments}
                    onSuccess={onSuccess}
                    disabled={!hasSelection}
                >
                    <Button variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={!hasSelection}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar Pagamentos
                    </Button>
                </AgendarPagamentosDialog>
            </div>
        </div>
    )
}
