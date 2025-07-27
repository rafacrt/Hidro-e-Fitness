
'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Beaker, BarChart, FileText } from "lucide-react"
import { cn } from '@/lib/utils';

type ActiveReport = 'equipamentos' | 'manutencao' | 'quimico' | 'custos';

const reportCardsData = [
    { 
        id: 'equipamentos',
        icon: Wrench,
        title: "Relatório de Equipamentos",
        description: "Status e performance dos equipamentos",
    },
    { 
        id: 'manutencao',
        icon: FileText,
        title: "Relatório de Manutenções",
        description: "Histórico e custos de manutenção",
    },
    { 
        id: 'quimico',
        icon: Beaker,
        title: "Controle Químico",
        description: "Consumo e qualidade da água",
    },
    { 
        id: 'custos',
        icon: BarChart,
        title: "Análise de Custos",
        description: "Custos operacionais e manutenção",
    }
]

interface RelatoriosManutencaoCardsProps {
    activeCard: ActiveReport;
    setActiveCard: (id: ActiveReport) => void;
}

export default function RelatoriosManutencaoCards({ activeCard, setActiveCard }: RelatoriosManutencaoCardsProps) {
    const handleCardClick = (id: ActiveReport) => {
        setActiveCard(id);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportCardsData.map((card) => {
                const isActive = activeCard === card.id;
                return (
                    <Card 
                        key={card.id} 
                        className={cn(
                            'hover:shadow-lg transition-shadow cursor-pointer',
                            isActive ? 'bg-primary/10 border-primary' : ''
                        )}
                        onClick={() => handleCardClick(card.id as ActiveReport)}
                    >
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className={cn('p-2 rounded-lg', isActive ? '' : 'bg-secondary')}>
                               <card.icon className={cn('h-6 w-6', isActive ? 'text-primary' : 'text-muted-foreground')} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{card.title}</h3>
                                <p className="text-xs text-muted-foreground">{card.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
