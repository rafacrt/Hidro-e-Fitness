
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, History } from "lucide-react"
import type { ActiveTabFrequencia } from "@/app/frequencia/page";

const filters: { label: ActiveTabFrequencia; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: Eye },
    { label: "Controle de Presença", icon: CheckCircle },
    { label: "Histórico", icon: History },
]

interface FrequenciaFiltersProps {
    activeTab: ActiveTabFrequencia;
    setActiveTab: (tab: ActiveTabFrequencia) => void;
}

export default function FrequenciaFilters({ activeTab, setActiveTab }: FrequenciaFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {filters.map((filter, index) => (
                <Button 
                    key={index} 
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
