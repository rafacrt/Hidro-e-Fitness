import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, FileText, Repeat, FileWarning } from "lucide-react"

const reportCards = [
    { 
        icon: TrendingUp,
        title: "Relatório de Receitas",
        description: "Análise detalhada das receitas por modalidade e período",
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        borderColor: "border-green-200",
        active: true
    },
    { 
        icon: FileText,
        title: "Relatório de Despesas",
        description: "Controle de gastos por categoria e fornecedor",
        bgColor: "bg-background",
        iconColor: "text-muted-foreground"
    },
    { 
        icon: Repeat,
        title: "Fluxo de Caixa",
        description: "Movimentação financeira completa com projeções",
        bgColor: "bg-background",
        iconColor: "text-muted-foreground"
    },
    { 
        icon: FileWarning,
        title: "Relatório de Inadimplência",
        description: "Lista de alunos em atraso e análise de cobrança",
        bgColor: "bg-background",
        iconColor: "text-muted-foreground"
    }
]

export default function CardsRelatorios() {
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
