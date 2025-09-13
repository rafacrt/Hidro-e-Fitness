
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button"
import { Eye, CreditCard, DollarSign, History } from "lucide-react"

type ActiveTab = "Visão Geral" | "Métodos de Pagamento" | "Histórico";

const filters: { label: ActiveTab; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: Eye },
    { label: "Métodos de Pagamento", icon: CreditCard },
    { label: "Histórico", icon: History },
]

interface PagamentosFiltersProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

export default function PagamentosFilters({ activeTab, setActiveTab }: PagamentosFiltersProps) {
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
