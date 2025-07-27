
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, BarChart, Percent, FileText } from "lucide-react"

const reportCards = [
    { 
        icon: FileText,
        title: "Relatório de Receita",
        description: "Análise detalhada da receita por período e método",
        active: true
    },
    { 
        icon: BarChart,
        title: "Performance dos Métodos",
        description: "Análise de performance por método de pagamento",
    },
    { 
        icon: Percent,
        title: "Taxa de Conversão",
        description: "Análise de conversão e abandono de pagamentos",
    },
    { 
        icon: TrendingUp,
        title: "Análise de Taxas",
        description: "Custos e taxas por método de pagamento",
    }
]

export default function RelatoriosPagamentosCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportCards.map((card, index) => (
                <Card key={index} className={`${card.active ? `bg-green-50 border-green-200` : ''} hover:shadow-lg transition-shadow cursor-pointer`}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${card.active ? '' : 'bg-secondary'}`}>
                           <card.icon className={`h-6 w-6 ${card.active ? 'text-green-600' : 'text-secondary-foreground'}`} />
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
