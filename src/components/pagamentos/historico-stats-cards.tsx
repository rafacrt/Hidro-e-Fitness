
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, DollarSign, Receipt, AlertCircle } from "lucide-react";
import type { PaymentStats } from "@/app/pagamentos/actions";

interface HistoricoStatsCardsProps {
  stats: PaymentStats;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function HistoricoStatsCards({ stats }: HistoricoStatsCardsProps) {
  const statCards = [
    { title: "Volume Total", value: formatCurrency(stats.totalVolume), icon: DollarSign, color: "bg-blue-50 text-blue-800" },
    { title: "Recebido", value: formatCurrency(stats.approvedVolume), icon: CheckCircle2, color: "bg-green-50 text-green-800" },
    { title: "Pendente", value: formatCurrency(stats.pendingVolume), icon: Clock, color: "bg-yellow-50 text-yellow-800" },
    { title: "Vencido", value: formatCurrency(stats.overdueVolume), icon: AlertCircle, color: "bg-red-50 text-red-800" },
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
  );
}
