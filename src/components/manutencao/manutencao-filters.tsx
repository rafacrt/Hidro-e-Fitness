
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button"
import { Eye, Wrench, Calendar, Beaker, BarChart2 } from "lucide-react"

type ActiveTab = "Visão Geral" | "Equipamentos" | "Agendamentos" | "Produtos Químicos" | "Relatórios";

const filters: { label: ActiveTab; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: Eye },
    { label: "Equipamentos", icon: Wrench },
    { label: "Agendamentos", icon: Calendar },
    { label: "Produtos Químicos", icon: Beaker },
    { label: "Relatórios", icon: BarChart2 },
]

interface ManutencaoFiltersProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

export default function ManutencaoFilters({ activeTab, setActiveTab }: ManutencaoFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {filters.map((filter) => (
                <Button 
                    key={filter.label} 
                    variant={activeTab === filter.label ? "secondary" : "ghost"} 
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
