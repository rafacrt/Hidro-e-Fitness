import { Button } from "@/components/ui/button"
import { Eye, Settings, Tag, BarChart } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: Eye },
    { label: "Gerenciar Modalidades", icon: Settings, active: true },
    { label: "Preços e Planos", icon: Tag },
    { label: "Relatórios", icon: BarChart },
]

export default function ModalitiesFilters() {
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
