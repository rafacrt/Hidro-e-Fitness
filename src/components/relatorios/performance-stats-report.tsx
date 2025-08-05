
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, UserPlus, UserMinus } from "lucide-react";

const stats = [
    { title: "Receita Média por Aluno", value: "R$ 175,30", icon: DollarSign, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Alunos Mais Engajados", value: "Hidroginástica", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Novos Alunos (Mês)", value: "28", icon: UserPlus, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { title: "Cancelamentos (Mês)", value: "5", icon: UserMinus, color: "text-red-600", bgColor: "bg-red-50" },
];

export default function PerformanceStatsReport() {
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
