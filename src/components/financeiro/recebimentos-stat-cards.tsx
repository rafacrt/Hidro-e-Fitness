
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CheckCircle2, Clock, CalendarX } from "lucide-react";
import type { Database } from '@/lib/database.types';

type Payment = Database['public']['Tables']['payments']['Row'];

interface RecebimentosStatCardsProps {
    recebimentos: Payment[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function RecebimentosStatCards({ recebimentos }: RecebimentosStatCardsProps) {
    const stats = React.useMemo(() => {
        return recebimentos.reduce((acc, p) => {
            const amount = p.amount || 0;
            acc.total += amount;
            if (p.status === 'pago') acc.recebido += amount;
            if (p.status === 'pendente') acc.pendente += amount;
            if (p.status === 'vencido') acc.vencido += amount;
            return acc;
        }, { total: 0, recebido: 0, pendente: 0, vencido: 0 });
    }, [recebimentos]);

    const statCards = [
        { title: "Total", value: formatCurrency(stats.total), icon: DollarSign, color: "bg-zinc-100 text-zinc-800" },
        { title: "Recebido", value: formatCurrency(stats.recebido), icon: CheckCircle2, color: "bg-green-100 text-green-800" },
        { title: "Pendente", value: formatCurrency(stats.pendente), icon: Clock, color: "bg-yellow-100 text-yellow-800" },
        { title: "Vencido", value: formatCurrency(stats.vencido), icon: CalendarX, color: "bg-red-100 text-red-800" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
                <Card key={index} className={stat.color}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <stat.icon className="h-8 w-8" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
