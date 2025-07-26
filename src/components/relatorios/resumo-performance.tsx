import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart, Smile } from "lucide-react";

const performanceItems = [
    { 
        title: "Crescimento Mensal", 
        value: "+12.5%", 
        description: "Comparado ao mês anterior", 
        icon: TrendingUp, 
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
    },
    { 
        title: "Eficiência Operacional", 
        value: "94.2%", 
        description: "Taxa de ocupação média", 
        icon: BarChart,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    { 
        title: "Satisfação dos Alunos", 
        value: "4.8/5", 
        description: "Avaliação média", 
        icon: Smile,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
    },
];

export default function ResumoPerformance() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumo de Performance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {performanceItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                        <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${item.iconBg}`}>
                            <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{item.title}</p>
                            <p className="text-2xl font-bold">{item.value}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
