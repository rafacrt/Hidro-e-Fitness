import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { DollarSign, BarChart2, TrendingUp, FileText } from 'lucide-react';

const actions = [
  { label: 'Relatório Financeiro', description: 'Gerar relatório financeiro do mês atual', icon: DollarSign, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { label: 'Frequência Semanal', description: 'Relatório de frequência da semana', icon: BarChart2, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { label: 'Performance Geral', description: 'Análise completa de performance', icon: TrendingUp, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { label: 'Relatório Personalizado', description: 'Criar relatório com filtros específicos', icon: FileText, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
];

export default function AcoesRapidasRelatorios() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-auto p-4 flex flex-col items-start justify-start text-left">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${action.iconBg} mb-4`}>
                    <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <span className="text-sm font-semibold">{action.label}</span>
                <span className="text-xs text-muted-foreground font-normal">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
