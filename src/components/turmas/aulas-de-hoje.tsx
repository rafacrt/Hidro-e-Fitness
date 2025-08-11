
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];
type ClassData = ClassRow & { instructors: Pick<Instructor, 'name'> | null } & { modalities: Pick<Modality, 'name'> | null };

interface AulasDeHojeProps {
  classes: ClassData[];
}

const statusStyles: { [key: string]: string } = {
    'Aguardando': 'bg-blue-100 text-blue-800 border-blue-200',
    'Em Andamento': 'bg-green-100 text-green-800 border-green-200',
    'Concluída': 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

const getStatus = (startTime: string, endTime: string): keyof typeof statusStyles => {
  const now = new Date();
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0);
  
  const endDate = new Date();
  endDate.setHours(endHour, endMinute, 0, 0);

  if (now < startDate) {
    return 'Aguardando';
  } else if (now >= startDate && now <= endDate) {
    return 'Em Andamento';
  } else {
    return 'Concluída';
  }
};

export default function AulasDeHoje({ classes }: AulasDeHojeProps) {
  const today = new Date().toLocaleString('pt-BR', { weekday: 'long' });
  const todayClasses = classes
    .filter(cls => cls.days_of_week.some(day => day.toLowerCase() === today.toLowerCase()))
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aulas de Hoje</CardTitle>
        <CardDescription>Todas as aulas agendadas para hoje</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayClasses.length > 0 ? todayClasses.map((cls) => {
          const status = getStatus(cls.start_time, cls.end_time);
          return (
            <div key={cls.id} className="flex items-center space-x-4">
              <div className="flex-grow">
                <div className='flex items-center justify-between'>
                  <p className="font-semibold">{cls.name}</p>
                  <Badge variant="outline" className={statusStyles[status]}>{status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{cls.start_time} - {cls.end_time} - {cls.instructors?.name || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">0/{cls.max_students}</p>
                <p className="text-xs text-muted-foreground">alunos</p>
              </div>
            </div>
          )
        }) : (
          <p className="text-center text-muted-foreground py-4">Nenhuma aula para hoje.</p>
        )}
      </CardContent>
    </Card>
  );
}
