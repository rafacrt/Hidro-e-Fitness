
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Banknote, CalendarClock } from "lucide-react";

const stats = [
    { title: "Receitas", value: "R$ 35.500,00", icon: TrendingUp, color: "bg-green-50 text-green-700", borderColor: "border-green-200" },
    { title: "Despesas", value: "R$ 8.670,00", icon: TrendingDown, color: "bg-red-50 text-red-700", borderColor: "border-red-200" },
    { title: "Fluxo Líquido", value: "+R$ 26.830,00", icon: DollarSign, color: "bg-blue-50 text-blue-700", borderColor: "border-blue-200" },
    { title: "Saldo Atual", value: "R$ 41.830,00", icon: Banknote, color: "bg-zinc-100 text-zinc-700", borderColor: "border-zinc-200" },
    { title: "Projeção", value: "R$ 64.830,00", icon: CalendarClock, color: "bg-yellow-50 text-yellow-700", borderColor: "border-yellow-200" },
];

export default function FluxoDeCaixaStatCards() {
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
