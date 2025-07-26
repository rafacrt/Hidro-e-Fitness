import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, CalendarPlus, Beaker, Wrench, Activity } from 'lucide-react';
import { Separator } from '../ui/separator';

const activities = [
  {
    title: 'Manutenção concluída',
    description: 'Filtro de Areia',
    author: 'João Silva',
    time: '2 horas atrás',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
  },
  {
    title: 'Agendamento criado',
    description: 'Bomba da Piscina 2',
    author: 'Carlos Santos',
    time: '4 horas atrás',
    icon: CalendarPlus,
    iconColor: 'text-blue-600',
  },
  {
    title: 'Produto químico adicionado',
    description: 'Cloro - 50kg',
    author: 'Ana Costa',
    time: '1 dia atrás',
    icon: Beaker,
    iconColor: 'text-purple-600',
  },
  {
    title: 'Inspeção realizada',
    description: 'Sistema de Ventilação',
    author: 'Roberto Lima',
    time: '2 dias atrás',
    icon: Wrench,
    iconColor: 'text-orange-600',
  },
];

export default function AtividadesRecentesManutencao() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Atividades Recentes</CardTitle>
        <Activity className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-start gap-4">
                <activity.icon className={`h-5 w-5 mt-1 ${activity.iconColor}`} />
                <div className="flex-grow">
                  <p className="font-semibold text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description} - {activity.author}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
