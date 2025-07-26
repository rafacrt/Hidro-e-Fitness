import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus, Wrench, Beaker, AlertTriangle } from 'lucide-react';

const actions = [
  { label: 'Nova Manutenção', icon: Plus },
  { label: 'Inspeção Geral', icon: Wrench },
  { label: 'Análise Química', icon: Beaker },
  { label: 'Reparo Emergencial', icon: AlertTriangle },
];

export default function AcoesRapidasManutencao() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-auto flex-col p-6 gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
                <action.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
