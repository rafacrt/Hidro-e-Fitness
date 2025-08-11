
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Banknote, CalendarClock } from "lucide-react";
import type { FinancialSummary } from "@/app/financeiro/actions";

interface FluxoDeCaixaStatCardsProps {
    summary: FinancialSummary;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function FluxoDeCaixaStatCards({ summary }: FluxoDeCaixaStatCardsProps) {
    const stats = [
        { title: "Receitas", value: formatCurrency(summary.totalRevenue), icon: TrendingUp, color: "bg-green-50 text-green-700", borderColor: "border-green-200" },
        { title: "Despesas", value: formatCurrency(summary.totalExpenses), icon: TrendingDown, color: "bg-red-50 text-red-700", borderColor: "border-red-200" },
        { title: "Fluxo Líquido", value: formatCurrency(summary.netFlow), icon: DollarSign, color: "bg-blue-50 text-blue-700", borderColor: "border-blue-200" },
        { title: "Saldo Atual", value: formatCurrency(summary.currentBalance), icon: Banknote, color: "bg-zinc-100 text-zinc-700", borderColor: "border-zinc-200" },
        { title: "Projeção", value: "R$ 0,00", icon: CalendarClock, color: "bg-yellow-50 text-yellow-700", borderColor: "border-yellow-200" },
    ];
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className={`${stat.color} border ${stat.borderColor}`}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{stat.title}</p>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
