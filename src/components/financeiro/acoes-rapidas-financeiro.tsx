
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload, FileText } from 'lucide-react';
import { AddTransacaoDialog } from './add-transacao-dialog';
import { ExportFinanceiroDialog } from './export-financeiro-dialog';

const actions = [
  { label: 'Nova Transação', icon: Plus, component: AddTransacaoDialog },
  { label: 'Exportar Relatório', icon: Download, component: ExportFinanceiroDialog },
  { label: 'Importar Extrato', icon: Upload },
  { label: 'Conciliação Bancária', icon: FileText },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

export default function AcoesRapidasFinanceiro() {
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
              <div key={index} className="w-full cursor-pointer">
                {buttonContent(action)}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
