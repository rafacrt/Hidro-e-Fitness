'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus, Copy, Tag, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const actions = [
  { label: 'Novo Plano', icon: Plus, variant: 'default' },
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
          {actions.map((action, index) => (
            <Button 
              key={index} 
              variant={action.variant as any} 
              className="h-auto p-4 flex items-center justify-center gap-2"
              onClick={() => handleActionClick(action.label)}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
