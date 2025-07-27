import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Beaker, Package, AlertTriangle, FileText } from 'lucide-react';

const actions = [
  { label: 'Teste de Água', icon: Beaker, variant: 'secondary', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { label: 'Reabastecer Estoque', icon: Package, variant: 'secondary', className: 'bg-green-600 hover:bg-green-700 text-white' },
  { label: 'Alerta de Estoque', icon: AlertTriangle, variant: 'secondary', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { label: 'Relatório de Consumo', icon: FileText, variant: 'secondary', className: 'bg-teal-600 hover:bg-teal-700 text-white' },
];

export default function AcoesRapidasProdutosQuimicos() {
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
