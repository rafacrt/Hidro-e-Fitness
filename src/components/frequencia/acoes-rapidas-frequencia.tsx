
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { CheckSquare, List, AlertCircle, BarChartHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarkAttendanceDialog } from './mark-attendance-dialog';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type UpcomingClass = ClassRow & { instructors: Pick<Instructor, 'name'> | null };

interface AcoesRapidasFrequenciaProps {
  classes: UpcomingClass[];
}

const actions = [
  { label: 'Marcar Presença', icon: CheckSquare, component: MarkAttendanceDialog },
  { label: 'Lista de Presença', icon: List },
  { label: 'Justificar Falta', icon: AlertCircle },
  { label: 'Relatório Mensal', icon: BarChartHorizontal },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

export default function AcoesRapidasFrequencia({ classes }: AcoesRapidasFrequenciaProps) {
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
                variant="outline" 
                className="h-auto flex-col p-6 gap-2 w-full"
              >
                  <IconWrapper>
                      <action.icon className="h-8 w-8 text-secondary-foreground" />
                  </IconWrapper>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );

            const ActionComponent = action.component;

            if (ActionComponent) {
                return (
                    <ActionComponent key={index} classes={classes}>
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
