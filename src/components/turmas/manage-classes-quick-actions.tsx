import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { PlusCircle, UserPlus, Copy, CalendarClock } from 'lucide-react';

const actions = [
  { label: 'Nova Turma', icon: PlusCircle, variant: 'default' },
  { label: 'Matricular Alunos', icon: UserPlus, variant: 'secondary' },
  { label: 'Duplicar Turma', icon: Copy, variant: 'secondary' },
  { label: 'Reagendar Aulas', icon: CalendarClock, variant: 'secondary' },
];

export default function ManageClassesQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant as any} className="h-auto p-3 flex items-center justify-center gap-2">
              <action.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
