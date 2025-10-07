
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { DetalhesTransacaoDialog } from './detalhes-transacao-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DeleteTransacaoAlert } from './delete-transacao-alert';

type Payment = Database['public']['Tables']['payments']['Row'];

interface TransacoesRecentesTableProps {
  transactions: Payment[];
  onSuccess: () => void;
}

const statusConfig: { [key: string]: { text: string; icon: React.ElementType; className: string } } = {
  pago: { text: 'Pago', icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-200' },
  pendente: { text: 'Pendente', icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  vencido: { text: 'Vencido', icon: AlertCircle, className: 'bg-red-100 text-red-800 border-red-200' },
};

const formatCurrency = (value: number | null) => {
    if (value === null) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function TransacoesRecentesTable({ transactions, onSuccess }: TransacoesRecentesTableProps) {
    
    const recentTransactions = transactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {recentTransactions.map((transacao) => {
                    const statusInfo = statusConfig[transacao.status] || statusConfig.pendente;
                    const isReceita = (transacao.amount || 0) > 0;

                    return (
                        <DetalhesTransacaoDialog transacao={transacao} key={transacao.id} onSuccess={onSuccess}>
                            <TableRow className="cursor-pointer">
                                <TableCell className="text-sm text-muted-foreground">{format(new Date(transacao.created_at), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {isReceita ? (
                                            <ArrowUpCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <ArrowDownCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{transacao.description}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{isReceita ? 'Receita' : 'Despesa'}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className={cn('font-semibold', isReceita ? 'text-green-600' : 'text-red-600')}>
                                    {formatCurrency(transacao.amount)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={statusInfo.className}>
                                        <statusInfo.icon className="mr-1.5 h-3 w-3" />
                                        {statusInfo.text}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DeleteTransacaoAlert transacaoId={transacao.id} onSuccess={onSuccess}>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DeleteTransacaoAlert>
                                </TableCell>
                            </TableRow>
                        </DetalhesTransacaoDialog>
                    )
                })}
                </TableBody>
            </Table>
            </div>
        </CardContent>
    </Card>
  );
}
