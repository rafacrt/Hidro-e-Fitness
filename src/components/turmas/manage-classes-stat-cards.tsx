import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle, Users, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

const statCards = [
    {
        title: "Total de Turmas",
        value: "5",
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
    },
    {
        title: "Turmas Ativas",
        value: "3",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50"
    },
    {
        title: "Alunos Matriculados",
        value: "55",
        icon: Users,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
    },
    {
        title: "Taxa de Ocupação",
        value: "73%",
        icon: Percent,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
    }
]

export default function ManageClassesStatCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <Card key={index} className={cn("border-l-4", 
            card.title === 'Total de Turmas' ? 'border-blue-500' :
            card.title === 'Turmas Ativas' ? 'border-green-500' :
            card.title === 'Alunos Matriculados' ? 'border-orange-500' : 'border-yellow-500'
        )}>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-full", card.bgColor)}>
                    <card.icon className={cn("h-6 w-6", card.color)} />
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
