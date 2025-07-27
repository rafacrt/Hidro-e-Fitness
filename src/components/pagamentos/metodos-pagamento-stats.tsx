
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Percent, DollarSign, CheckCircle } from "lucide-react";

const stats = [
    { title: "Métodos Ativos", value: "4", icon: CreditCard, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Taxa Média", value: "1.1%", icon: Percent, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Volume Total", value: "R$ 42.500", icon: DollarSign, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { title: "Taxa de Sucesso", value: "77.9%", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
];

export default function MetodosPagamentoStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="shadow-sm">
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
    );
}
