
import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart, DollarSign, Receipt } from "lucide-react"

const stats = [
    { title: "Planos Ativos", value: "6", icon: Receipt },
    { title: "Total de Alunos", value: "296", icon: Users },
    { title: "Preço Médio", value: "R$ 350,00", icon: DollarSign },
    { title: "Receita Total", value: "R$ 73.202", icon: BarChart },
]

export default function PlanosPrecosStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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
