
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { AddTransacaoDialog } from './add-transacao-dialog';
import { ExportFinanceiroDialog } from './export-financeiro-dialog';
import { useToast } from '@/hooks/use-toast';

const actions = [
  { label: 'Nova Transação', icon: Plus, component: AddTransacaoDialog },
  { label: 'Exportar Relatório', icon: Download, component: ExportFinanceiroDialog },
  { label: 'Importar Extrato', icon: Upload },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

export default function AcoesRapidasFinanceiro() {
  const { toast } = useToast();

  const handleActionClick = (label: string) => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: `A ação "${label}" será implementada em breve.`,
    });
  };

  const buttonContent = (action: (typeof actions)[0]) => (
    <Button variant="outline" className="h-auto flex-col p-6 gap-2 w-full">
        <IconWrapper>
            <action.icon className="h-8 w-8 text-secondary-foreground" />
        </IconWrapper>
        <span className="text-sm font-medium">{action.label}</span>
    </Button>
  );

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
              return (
                <ActionComponent key={index}>
                  {buttonContent(action)}
                </ActionComponent>
              )
            }
            return (
              <div key={index} className="w-full cursor-pointer" onClick={() => handleActionClick(action.label)}>
                {buttonContent(action)}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
