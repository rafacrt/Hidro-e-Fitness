
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus, Copy, Tag, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddPlanForm } from './add-plan-form';

const actions = [
  { label: 'Novo Plano', icon: Plus, variant: 'default', component: AddPlanForm },
  { label: 'Duplicar Plano', icon: Copy, variant: 'secondary' },
  { label: 'Ajustar Preços', icon: Tag, variant: 'secondary' },
  { label: 'Análise de Performance', icon: BarChart, variant: 'secondary' },
];

export default function PlanosPrecosActions() {
  const { toast } = useToast();

  const handleActionClick = (label: string) => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: `A ação "${label}" será implementada em breve.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const buttonContent = (
              <Button
                variant={action.variant as any}
                className="h-auto p-4 flex items-center justify-center gap-2 w-full"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );

            const ActionComponent = action.component;

            if (ActionComponent) {
              return <ActionComponent key={index}>{buttonContent}</ActionComponent>;
            }

            return (
              <div key={index} onClick={() => handleActionClick(action.label)} className="w-full cursor-pointer">
                {buttonContent}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

    