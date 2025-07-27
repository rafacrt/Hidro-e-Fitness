import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CheckCircle2, Clock, CalendarX } from "lucide-react";

const stats = [
    { title: "Total", value: "R$ 690,00", icon: DollarSign, color: "bg-zinc-100 text-zinc-800" },
    { title: "Recebido", value: "R$ 180,00", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
    { title: "Pendente", value: "R$ 350,00", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
    { title: "Vencido", value: "R$ 160,00", icon: CalendarX, color: "bg-red-100 text-red-800" },
];

export default function RecebimentosStatCards() {
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
