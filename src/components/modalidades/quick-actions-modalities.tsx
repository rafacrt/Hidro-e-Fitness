
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { PlusCircle, CheckCircle, DollarSign, CalendarPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddModalityForm } from './add-modality-form';

const actions = [
  { label: 'Nova Modalidade', icon: PlusCircle, component: AddModalityForm },
  { label: 'Ativar Selecionadas', icon: CheckCircle },
  { label: 'Ajustar Preços', icon: DollarSign },
  { label: 'Criar Turmas', icon: CalendarPlus },
];

export default function QuickActionsModalities() {
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
              <Button variant="outline" className="h-auto flex-col p-6 gap-2 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                    <action.icon className="h-8 w-8 text-secondary-foreground" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );

            const ActionComponent = action.component;
            if (ActionComponent) {
              return (
                <ActionComponent key={index}>
                    {buttonContent}
                </ActionComponent>
              )
            }

            return (
                <div key={index} onClick={() => handleActionClick(action.label)} className="w-full cursor-pointer">
                    {buttonContent}
                </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
