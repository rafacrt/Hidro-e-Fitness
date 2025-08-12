
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { PlusCircle, DollarSign } from 'lucide-react';
import type { ActiveTabModalities } from '@/app/modalidades/page';
import { AddModalityForm } from './add-modality-form';
import { useToast } from '@/hooks/use-toast';

const actions = [
  { label: 'Ajustar Preços', icon: DollarSign, action: 'prices' },
];

interface QuickActionsModalitiesProps {
    setActiveTab: (tab: ActiveTabModalities) => void;
}

export default function QuickActionsModalities({ setActiveTab }: QuickActionsModalitiesProps) {
  const { toast } = useToast();

  const handleActionClick = (action: 'prices') => {
    if (action === 'prices') {
      setActiveTab('Preços e Planos');
    }
  };
  
  const handleNotImplemented = () => {
     toast({
        title: 'Funcionalidade em desenvolvimento',
        description: `Esta ação será implementada em breve.`,
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AddModalityForm onSuccess={handleNotImplemented}>
                 <Button variant="outline" className="h-auto flex-col p-6 gap-2 w-full">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                        <PlusCircle className="h-8 w-8 text-secondary-foreground" />
                    </div>
                    <span className="text-sm font-medium">Nova Modalidade</span>
                </Button>
            </AddModalityForm>
          {actions.map((action, index) => {
            const buttonContent = (
              <Button variant="outline" className="h-auto flex-col p-6 gap-2 w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                    <action.icon className="h-8 w-8 text-secondary-foreground" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );

            return (
                <div key={index} onClick={() => handleActionClick(action.action as 'prices')} className="w-full cursor-pointer">
                    {buttonContent}
                </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
