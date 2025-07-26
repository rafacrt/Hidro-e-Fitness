import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, History, BarChart2, Settings } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: Eye, active: true },
    { label: "Controle de Presença", icon: CheckCircle },
    { label: "Histórico", icon: History },
    { label: "Relatórios", icon: BarChart2 },
    { label: "Configurações", icon: Settings },
]

export default function FrequenciaFilters() {
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
