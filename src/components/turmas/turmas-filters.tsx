import { Button } from "@/components/ui/button"
import { ClipboardList, BookOpen, UserCheck, BarChart3, Presentation, Users } from "lucide-react"

const filters = [
    { label: "Visão Geral", icon: ClipboardList },
    { label: "Grade de Horários", icon: BookOpen },
    { label: "Gerenciar Turmas", icon: UserCheck },
    { label: "Controle de Presença", icon: BarChart3 },
    { label: "Relatórios", icon: Presentation },
    { label: "Maestros", icon: Users }, // Assuming 'Maestros' refers to Instructors/Teachers
]

export default function TurmasFilters() {
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
