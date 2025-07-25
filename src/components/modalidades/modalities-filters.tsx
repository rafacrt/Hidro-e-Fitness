import { Button } from "@/components/ui/button"
import { ClipboardList, BookOpen, BarChart3, Presentation } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: ClipboardList },
    { label: "Listar Modalidades", icon: BookOpen },
    { label: "Preços e Planos", icon: BarChart3 },
    { label: "Relatórios", icon: Presentation },
]

export default function ModalitiesFilters() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter, index) => (
                <Button key={index} variant={index === 0 ? "default" : "outline"} className="font-normal">
                    <filter.icon className="mr-2 h-4 w-4" />
                    {filter.label}
                </Button>
            ))}
        </div>
    )
}
