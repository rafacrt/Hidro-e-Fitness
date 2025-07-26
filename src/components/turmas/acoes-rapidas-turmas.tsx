import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { CalendarPlus, UserPlus, CalendarCheck, BarChart2 } from 'lucide-react';

const actions = [
  { label: 'Nova Turma', icon: CalendarPlus },
  { label: 'Matricular Aluno', icon: UserPlus },
  { label: 'Agendar Aula', icon: CalendarCheck },
  { label: 'Marcar Presença', icon: BarChart2 },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-4">
        {children}
    </div>
)

export default function AcoesRapidasTurmas() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-auto flex-col p-6 gap-2">
                <IconWrapper>
                    <action.icon className="h-8 w-8 text-muted-foreground" />
                </IconWrapper>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
