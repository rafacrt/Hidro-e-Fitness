import { Button } from "@/components/ui/button"
import { ClipboardList, BookOpen, UserCheck, BarChart3, Presentation } from "lucide-react"

type ActiveTab = "Visão Geral" | "Grade de Horários" | "Gerenciar Turmas" | "Controle de Presença" | "Relatórios";

const filters: { label: ActiveTab; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: ClipboardList },
    { label: "Grade de Horários", icon: BookOpen },
    { label: "Gerenciar Turmas", icon: UserCheck },
    { label: "Controle de Presença", icon: BarChart3 },
    { label: "Relatórios", icon: Presentation },
];

interface TurmasFiltersProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

export default function TurmasFilters({ activeTab, setActiveTab }: TurmasFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {filters.map((filter, index) => (
                <Button 
                    key={index} 
                    variant={activeTab === filter.label ? "default" : "ghost"} 
                    onClick={() => setActiveTab(filter.label)}
                    className="font-normal text-muted-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold"
                    data-state={activeTab === filter.label ? 'active' : 'inactive'}
                >
                    <filter.icon className="mr-2 h-4 w-4" />
                    {filter.label}
                </Button>
            ))}
        </div>
    )
}
