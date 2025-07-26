import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, Smile } from "lucide-react"

const legendItems = [
    { label: "Natação Iniciante", color: "bg-blue-500" },
    { label: "Natação Intermediário", color: "bg-blue-500" },
    { label: "Natação Avançado", color: "bg-red-500" },
    { label: "Hidroginástica", color: "bg-green-500" },
    { label: "Natação Infantil", color: "bg-yellow-500" },
    { label: "Aqua Aeróbica", color: "bg-purple-500" },
]

const summaryCards = [
    {
        icon: Clock,
        title: "Horário de Pico",
        value: "09:00 - 10:00",
        description: "Maior ocupação",
        color: "bg-blue-50 text-blue-800"
    },
    {
        icon: Users,
        title: "Ocupação Média",
        value: "87%",
        description: "Esta semana",
        color: "bg-green-50 text-green-800"
    },
    {
        icon: Smile,
        title: "Espaços Disponíveis",
        value: "23 vagas",
        description: "Para esta semana",
        color: "bg-yellow-50 text-yellow-800"
    }
]

export function ScheduleLegend() {
    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Legenda das Modalidades</h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                    {legendItems.map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${item.color}`}></span>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summaryCards.map(card => (
                        <div key={card.title} className={`p-4 rounded-lg flex items-center gap-4 ${card.color}`}>
                            <div className="p-2 bg-white/50 rounded-full">
                                <card.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{card.title}</p>
                                <p className="text-lg font-bold">{card.value}</p>
                                <p className="text-xs">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
