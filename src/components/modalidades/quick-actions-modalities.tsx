import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { PlusCircle, CheckCircle, DollarSign, CalendarPlus } from 'lucide-react';

const actions = [
  { label: 'Nova Modalidade', icon: PlusCircle, variant: 'default' },
  { label: 'Ativar Selecionadas', icon: CheckCircle, variant: 'secondary' },
  { label: 'Ajustar Preços', icon: DollarSign, variant: 'secondary' },
  { label: 'Criar Turmas', icon: CalendarPlus, variant: 'secondary' },
];

export default function QuickActionsModalities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant as any} className="h-auto p-4 flex items-center justify-center gap-2">
              <action.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
