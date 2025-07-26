import { Button } from "@/components/ui/button"
import { Eye, Wrench, Calendar, Beaker, BarChart2 } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: Eye, active: true },
    { label: "Equipamentos", icon: Wrench },
    { label: "Agendamentos", icon: Calendar },
    { label: "Produtos Químicos", icon: Beaker },
    { label: "Relatórios", icon: BarChart2 },
]

export default function ManutencaoFilters() {
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
