import { Button } from "@/components/ui/button"
import { Eye, DollarSign, Users, BarChart2, TrendingUp, Sparkles } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: Eye, active: true },
    { label: "Financeiro", icon: DollarSign },
    { label: "Alunos", icon: Users },
    { label: "Frequência", icon: BarChart2 },
    { label: "Performance", icon: TrendingUp },
    { label: "Personalizados", icon: Sparkles },
]

export default function RelatoriosFilters() {
    return (
        <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {filters.map((filter, index) => (
                <Button key={index} variant={filter.active ? "secondary" : "ghost"} className="font-normal text-muted-foreground data-[active=true]:text-foreground data-[active=true]:font-semibold">
                    <filter.icon className="mr-2 h-4 w-4" />
                    {filter.label}
                </Button>
            ))}
        </div>
    )
}
