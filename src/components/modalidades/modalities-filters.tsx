
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Settings, Tag, BarChart } from "lucide-react";
import type { ActiveTabModalities } from '@/app/modalidades/page';

const filters: { label: ActiveTabModalities; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: Eye },
    { label: "Gerenciar Modalidades", icon: Settings },
    { label: "Preços e Planos", icon: Tag },
    { label: "Relatórios", icon: BarChart },
];

interface ModalitiesFiltersProps {
    activeTab: ActiveTabModalities;
    setActiveTab: (tab: ActiveTabModalities) => void;
}

export default function ModalitiesFilters({ activeTab, setActiveTab }: ModalitiesFiltersProps) {
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
