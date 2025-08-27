'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FluxoDeCaixaStatCards from "./fluxo-de-caixa-stat-cards";
import FluxoDeCaixaTable from "./fluxo-de-caixa-table";
import FluxoDeCaixaSummary from "./fluxo-de-caixa-summary";
import { Button } from "../ui/button";
import { BarChart2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { FinancialSummary } from "@/app/financeiro/actions";
import { eachMonthOfInterval, startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FluxoDeCaixaChartDialog } from './fluxo-de-caixa-chart-dialog';
import { getFinancialSummary } from '@/app/financeiro/actions';
import { useToast } from '@/hooks/use-toast';

interface FluxoDeCaixaTabProps {
    summary: FinancialSummary;
}

const generateMonthOptions = () => {
    const today = new Date();
    const startDate = subMonths(today, 6);
    const endDate = subMonths(today, -3); // 3 months in the future
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    return months.map(month => ({
        value: format(month, 'yyyy-MM'),
        label: format(month, 'MMMM / yyyy', { locale: ptBR }),
    })).reverse();
};

export default function FluxoDeCaixaTab({ summary: initialSummary }: FluxoDeCaixaTabProps) {
    const [summary, setSummary] = React.useState(initialSummary);
    const [selectedMonth, setSelectedMonth] = React.useState(format(new Date(), 'yyyy-MM'));
    const monthOptions = React.useMemo(() => generateMonthOptions(), []);
    const { toast } = useToast();

    const refreshData = async () => {
        try {
            const freshSummary = await getFinancialSummary();
            setSummary(freshSummary);
        } catch (error) {
            toast({
                title: 'Erro ao atualizar dados',
                description: 'Não foi possível buscar os dados financeiros mais recentes.',
                variant: 'destructive',
            });
        }
    };

    const filteredSummary = React.useMemo(() => {
        if (!summary || !summary.transactions) {
            return { totalRevenue: 0, totalExpenses: 0, netFlow: 0, currentBalance: 0, transactions: [] };
        }
        
        const [year, month] = selectedMonth.split('-').map(Number);
        const startDate = startOfMonth(new Date(year, month - 1));
        const endDate = endOfMonth(new Date(year, month - 1));

        const filteredTransactions = summary.transactions.filter(t => {
            const transactionDate = new Date(t.created_at);
            return transactionDate >= startDate && transactionDate <= endDate;
        });

        const periodSummary = filteredTransactions.reduce((acc, t) => {
            const amount = t.amount || 0;
            if (amount > 0) {
                acc.totalRevenue += amount;
            } else {
                acc.totalExpenses += amount;
            }
            return acc;
        }, { totalRevenue: 0, totalExpenses: 0 });

        return {
            totalRevenue: periodSummary.totalRevenue,
            totalExpenses: periodSummary.totalExpenses,
            netFlow: periodSummary.totalRevenue + periodSummary.totalExpenses,
            currentBalance: summary.currentBalance, // Keep the overall balance
            transactions: filteredTransactions,
        };

    }, [selectedMonth, summary]);

    return (
        <div className="space-y-6">
            <FluxoDeCaixaStatCards summary={filteredSummary} />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Fluxo de Caixa Detalhado</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[180px]">
                                <Calendar className="mr-2 h-4 w-4" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <span className="capitalize">{option.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FluxoDeCaixaChartDialog transactions={filteredSummary.transactions}>
                            <Button>
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Gráfico
                            </Button>
                        </FluxoDeCaixaChartDialog>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <FluxoDeCaixaTable transactions={filteredSummary.transactions} onSuccess={refreshData} />
                </CardContent>
            </Card>
            <FluxoDeCaixaSummary summary={filteredSummary} />
        </div>
    )
}
