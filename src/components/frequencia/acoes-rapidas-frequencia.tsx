
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { CheckSquare, List, AlertCircle, BarChartHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const actions = [
  { label: 'Marcar Presença', icon: CheckSquare },
  { label: 'Lista de Presença', icon: List },
  { label: 'Justificar Falta', icon: AlertCircle },
  { label: 'Relatório Mensal', icon: BarChartHorizontal },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

export default function AcoesRapidasFrequencia() {
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
              variant="outline" 
              className="h-auto flex-col p-6 gap-2 w-full cursor-pointer"
              onClick={() => handleActionClick(action.label)}
            >
                <IconWrapper>
                    <action.icon className="h-8 w-8 text-secondary-foreground" />
                </IconWrapper>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
