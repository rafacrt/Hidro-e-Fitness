'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { UserPlus, CalendarPlus, DollarSign, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddStudentForm } from '../alunos/add-student-form';

const actions = [
  { label: 'Novo Aluno', icon: UserPlus },
  { label: 'Nova Turma', icon: CalendarPlus },
  { label: 'Pagamento', icon: DollarSign },
  { label: 'Avaliação', icon: Award },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

export default function QuickActions() {
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
                  <IconWrapper>
                      <action.icon className="h-8 w-8 text-muted-foreground" />
                  </IconWrapper>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );

            if (action.label === 'Novo Aluno') {
              return (
                <AddStudentForm key={index}>
                  {buttonContent}
                </AddStudentForm>
              )
            }

            return (
              <div key={index} onClick={() => handleActionClick(action.label)} className="w-full">
                {buttonContent}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
