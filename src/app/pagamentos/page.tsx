'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, ArrowDownToDot, CreditCard, Repeat, DollarSign, Settings } from "lucide-react";

type ActiveTab = "Visão Geral" | "Recebimentos" | "Pagamentos" | "Fluxo de Caixa" | "Métodos de Pagamento" | "Planos e Preços";

const filters: { label: ActiveTab; icon: React.ElementType }[] = [
    { label: "Visão Geral", icon: Eye },
    { label: "Recebimentos", icon: ArrowDownToDot },
    { label: "Pagamentos", icon: CreditCard },
    { label: "Fluxo de Caixa", icon: Repeat },
    { label: "Métodos de Pagamento", icon: Settings },
    { label: "Planos e Preços", icon: DollarSign },
];

interface FiltrosFinanceiroProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

export default function FiltrosFinanceiro({ activeTab, setActiveTab }: FiltrosFinanceiroProps) {
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