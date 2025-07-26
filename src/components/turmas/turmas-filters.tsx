import { Button } from "@/components/ui/button"
import { ClipboardList, BookOpen, UserCheck, BarChart3, Presentation } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: ClipboardList },
    { label: "Grade de Horários", icon: BookOpen },
    { label: "Gerenciar Turmas", icon: UserCheck },
    { label: "Controle de Presença", icon: BarChart3 },
    { label: "Relatórios", icon: Presentation, active: true },
]

export default function TurmasFilters() {
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
