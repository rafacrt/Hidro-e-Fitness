import { Button } from "@/components/ui/button"
import { Eye, CreditCard, DollarSign, History, BarChart2 } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: Eye, active: true },
    { label: "Métodos de Pagamento", icon: CreditCard },
    { label: "Planos e Preços", icon: DollarSign },
    { label: "Histórico", icon: History },
    { label: "Relatórios", icon: BarChart2 },
]

export default function PagamentosFilters() {
    return (
        <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {filters.map((filter, index) => (
                <Button key={index} variant={filter.active ? "default" : "ghost"} className="font-normal text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold">
                    <filter.icon className="mr-2 h-4 w-4" />
                    {filter.label}
                </Button>
            ))}
        </div>
    )
}
