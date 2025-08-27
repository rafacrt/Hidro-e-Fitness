'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus, Copy, Tag, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddPlanForm } from './add-plan-form';
import { DuplicatePlanDialog } from './duplicate-plan-dialog';
import { AdjustPricesDialog } from './adjust-prices-dialog';
import { PerformanceAnalysisDialog } from './performance-analysis-dialog';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];

interface PlanosPrecosActionsProps {
  modalities: Modality[];
  onSuccess: () => void;
}

export default function PlanosPrecosActions({ modalities, onSuccess }: PlanosPrecosActionsProps) {
  const { toast } = useToast();

  const handleActionClick = (label: string) => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: `A ação "${label}" será implementada em breve.`,
    });
  };

  const actions = [
    { label: 'Novo Plano', icon: Plus, variant: 'default', component: AddPlanForm },
    { label: 'Duplicar Plano', icon: Copy, variant: 'secondary', component: DuplicatePlanDialog },
    { label: 'Ajustar Preços', icon: Tag, variant: 'secondary', component: AdjustPricesDialog },
    { label: 'Análise de Performance', icon: BarChart, variant: 'secondary', component: PerformanceAnalysisDialog },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const ActionComponent = action.component;

            if (ActionComponent) {
              if (action.label === 'Novo Plano') {
                // AddPlanForm não precisa mais de modalities, ela carrega internamente
                return (
                  <ActionComponent
                    key={index}
                    onSuccess={onSuccess}
                  >
                    <Button
                      variant={action.variant as any}
                      className="h-auto p-4 flex items-center justify-center gap-2 w-full"
                    >
                      <action.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </Button>
                  </ActionComponent>
                );
              }

              // Para outros componentes de dialog
              const buttonContent = (
                <Button
                  variant={action.variant as any}
                  className="h-auto p-4 flex items-center justify-center gap-2 w-full"
                >
                  <action.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );

              return <ActionComponent key={index}>{buttonContent}</ActionComponent>;
            }

            // Para ações sem componente
            return (
              <div key={index} onClick={() => handleActionClick(action.label)} className="w-full cursor-pointer">
                <Button
                  variant={action.variant as any}
                  className="h-auto p-4 flex items-center justify-center gap-2 w-full"
                >
                  <action.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}