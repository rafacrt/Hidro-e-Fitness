import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, DollarSign, Receipt } from "lucide-react";

const stats = [
    { title: "Volume Total", value: "R$ 1.516,00", icon: DollarSign, color: "bg-blue-50 text-blue-800" },
    { title: "Concluídos", value: "R$ 700,00", icon: CheckCircle2, color: "bg-green-50 text-green-800" },
    { title: "Pendentes", value: "R$ 150,00", icon: Clock, color: "bg-yellow-50 text-yellow-800" },
    { title: "Taxas", value: "R$ 27,01", icon: Receipt, color: "bg-red-50 text-red-800" },
];

export default function HistoricoStatsCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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
