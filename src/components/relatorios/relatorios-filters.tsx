
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, DollarSign, Users, BarChart2, TrendingUp, Sparkles } from "lucide-react";
import type { ActiveTab } from '@/app/relatorios/page';

const filters: { label: ActiveTab; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: Eye },
    { label: "Financeiro", icon: DollarSign },
    { label: "Alunos", icon: Users },
    { label: "Frequência", icon: BarChart2 },
    { label: "Performance", icon: TrendingUp },
    { label: "Personalizados", icon: Sparkles },
];

interface RelatoriosFiltersProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

export default function RelatoriosFilters({ activeTab, setActiveTab }: RelatoriosFiltersProps) {
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
