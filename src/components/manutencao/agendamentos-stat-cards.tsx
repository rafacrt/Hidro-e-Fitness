
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, DollarSign } from "lucide-react";

const stats = [
    { title: "Total Agendado", value: "5", icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { title: "Em Andamento", value: "1", icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
    { title: "Concluídas", value: "1", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { title: "Custo Total", value: "R$ 2.770,00", icon: DollarSign, color: "text-teal-600", bgColor: "bg-teal-50", borderColor: "border-teal-200" },
];

export default function AgendamentosStatCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className={`border ${stat.borderColor}`}>
                    <CardContent className={`p-4 flex items-center gap-4 rounded-lg ${stat.bgColor}`}>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${stat.color}`}>{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
