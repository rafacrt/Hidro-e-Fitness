'use client';

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart, TrendingUp, Calendar, Clock } from "lucide-react"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ActiveReport = 'ocupacao' | 'frequencia' | 'performance' | 'horarios';

const reportCardsData = [
    { 
        id: 'ocupacao',
        icon: Users,
        title: "Relatório de Ocupação",
        description: "Taxa de ocupação por turma e período",
    },
    { 
        id: 'frequencia',
        icon: Clock,
        title: "Relatório de Frequência",
        description: "Análise de presença e assiduidade dos alunos",
    },
    { 
        id: 'performance',
        icon: TrendingUp,
        title: "Performance das Turmas",
        description: "Análise de desempenho e rentabilidade",
    },
    { 
        id: 'horarios',
        icon: Calendar,
        title: "Relatório de Horários",
        description: "Distribuição de turmas por horário e dia",
    }
]

interface RelatoriosTurmasCardsProps {
    activeCard: ActiveReport;
    setActiveCard: (id: ActiveReport) => void;
}

export default function RelatoriosTurmasCards({ activeCard, setActiveCard }: RelatoriosTurmasCardsProps) {
    const { toast } = useToast();

    const handleCardClick = (id: ActiveReport, title: string) => {
        if (id === 'ocupacao' || id === 'frequencia' || id === 'performance') {
            setActiveCard(id);
        } else {
            toast({
                title: 'Funcionalidade em desenvolvimento',
                description: `O relatório de "${title}" será implementado em breve.`,
            });
        }
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
                            isActive ? 'bg-yellow-50 border-yellow-200' : ''
                        )}
                        onClick={() => handleCardClick(card.id as ActiveReport, card.title)}
                    >
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className={cn('p-2 rounded-lg', isActive ? '' : 'bg-secondary')}>
                               <card.icon className={cn('h-6 w-6', isActive ? 'text-yellow-600' : 'text-muted-foreground')} />
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
