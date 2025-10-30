'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart, DollarSign, Receipt } from "lucide-react"
import type { PlansStats } from "@/app/modalidades/actions"

interface PlanosPrecosStatsProps {
    stats: PlansStats;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default function PlanosPrecosStats({ stats }: PlanosPrecosStatsProps) {
    const statsData = [
        { title: "Planos Ativos", value: stats.activePlans.toString(), icon: Receipt },
        { title: "Total de Alunos", value: stats.totalStudents.toString(), icon: Users },
        { title: "Preço Médio", value: formatCurrency(stats.averagePrice), icon: DollarSign },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
                <Card key={index} className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-800 font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-yellow-900">{stat.value}</p>
                        </div>
                        <stat.icon className="h-8 w-8 text-yellow-700" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
