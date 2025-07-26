import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart, TrendingUp, Calendar } from "lucide-react"

const reportCards = [
    { 
        icon: Users,
        title: "Relatório de Ocupação",
        description: "Taxa de ocupação por turma e período",
        bgColor: "bg-cyan-50",
        iconColor: "text-cyan-600",
        borderColor: "border-cyan-200",
        active: true
    },
    { 
        icon: BarChart,
        title: "Relatório de Frequência",
        description: "Análise de presença e assiduidade dos alunos",
        bgColor: "bg-background",
        iconColor: "text-muted-foreground"
    },
    { 
        icon: TrendingUp,
        title: "Performance das Turmas",
        description: "Análise de desempenho e rentabilidade",
        bgColor: "bg-background",
        iconColor: "text-muted-foreground"
    },
    { 
        icon: Calendar,
        title: "Relatório de Horários",
        description: "Distribuição de turmas por horário e dia",
        bgColor: "bg-background",
        iconColor: "text-muted-foreground"
    }
]

export default function RelatoriosTurmasCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportCards.map((card, index) => (
                <Card key={index} className={`${card.active ? `${card.bgColor} ${card.borderColor}` : ''} hover:shadow-lg transition-shadow cursor-pointer`}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${card.active ? '' : 'bg-secondary'}`}>
                           <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">{card.title}</h3>
                            <p className="text-xs text-muted-foreground">{card.description}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
