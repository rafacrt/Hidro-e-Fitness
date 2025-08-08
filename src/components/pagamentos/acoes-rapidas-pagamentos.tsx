'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { QrCode, Link, MessageSquare, Laptop } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VirtualTerminalDialog } from './virtual-terminal-dialog';

const actions = [
  { label: 'Gerar PIX', icon: QrCode },
  { label: 'Link de Pagamento', icon: Link },
  { label: 'Enviar Cobrança', icon: MessageSquare },
  { label: 'Terminal Virtual', icon: Laptop, component: VirtualTerminalDialog },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

export default function AcoesRapidasPagamentos() {
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
                      <action.icon className="h-8 w-8 text-secondary-foreground" />
                  </IconWrapper>
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
