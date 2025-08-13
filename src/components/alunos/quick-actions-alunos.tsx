
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { quickActionsAlunos } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { AddStudentForm } from './add-student-form';
import { ExportStudentDialog } from './export-student-dialog';
import { ImportStudentDialog } from './import-student-dialog';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

interface QuickActionsAlunosProps {
  onSuccess: () => void;
}

export default function QuickActionsAlunos({ onSuccess }: QuickActionsAlunosProps) {
  const { toast } = useToast();

  const handleActionClick = (label: string) => {
    if (label !== 'Novo Aluno') {
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: `A ação "${label}" será implementada em breve.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActionsAlunos.map((action, index) => {
            const buttonContent = (
              <Button variant="outline" className="h-auto flex-col p-6 gap-2 w-full">
                  <IconWrapper>
                      <action.icon className="h-8 w-8 text-secondary-foreground" />
                  </IconWrapper>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );

            if (action.label === 'Novo Aluno') {
              return (
                 <AddStudentForm key={index} onSuccess={onSuccess}>
                   {buttonContent}
                </AddStudentForm>
              )
            }
            if (action.label === 'Exportar Dados') {
                return (
                    <ExportStudentDialog key={index}>
                        {buttonContent}
                    </ExportStudentDialog>
                )
            }
            if (action.label === 'Importar Alunos') {
                return (
                    <ImportStudentDialog key={index}>
                        {buttonContent}
                    </ImportStudentDialog>
                )
            }
            return (
                <div key={index} onClick={() => handleActionClick(action.label)}>
                  {buttonContent}
                </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
