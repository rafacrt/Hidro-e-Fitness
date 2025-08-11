
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle, Users, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];

interface ManageClassesStatCardsProps {
  classes: ClassRow[];
}

export default function ManageClassesStatCards({ classes }: ManageClassesStatCardsProps) {
  const totalClasses = classes.length;
  const activeClasses = classes.filter(c => c.status === 'ativa').length;
  // TODO: Fetch real student count per class to calculate this
  const totalStudents = 0; 
  const totalCapacity = classes.reduce((acc, c) => acc + (c.max_students || 0), 0);
  const occupancyRate = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;
  
  const statCards = [
    {
        title: "Total de Turmas",
        value: totalClasses.toString(),
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
    },
    {
        title: "Turmas Ativas",
        value: activeClasses.toString(),
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50"
    },
    {
        title: "Alunos Matriculados",
        value: "0", // Mock
        icon: Users,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
    },
    {
        title: "Taxa de Ocupação",
        value: `${occupancyRate.toFixed(0)}%`, // Mock
        icon: Percent,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
    }
  ]

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
