
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus, Wrench, FileText } from 'lucide-react';

const actions = [
  { label: 'Novo Equipamento', icon: Plus, variant: 'default' },
  { label: 'Agendar Manutenção', icon: Wrench, variant: 'secondary', className: 'bg-green-600 hover:bg-green-700 text-white' },
  { label: 'Inspeção Geral', icon: Wrench, variant: 'secondary', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { label: 'Relatório de Falhas', icon: FileText, variant: 'secondary', className: 'bg-teal-600 hover:bg-teal-700 text-white' },
];

export default function EquipamentosQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant as any} className={action.className}>
              <action.icon className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
