import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type UpcomingClass = ClassRow & { instructors: Pick<Instructor, 'name'> | null };

interface AulasDeHojeFrequenciaProps {
  classes: UpcomingClass[];
}

const statusStyles: { [key: string]: string } = {
    'Concluída': 'bg-green-100 text-green-800 border-green-200',
    'Em Andamento': 'bg-blue-100 text-blue-800 border-blue-200',
    'Agendada': 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function AulasDeHojeFrequencia({ classes }: AulasDeHojeFrequenciaProps) {
  // Mocking status for demonstration as it's not in the DB
  const getMockStatus = (startTime: string) => {
    const now = new Date();
    const [hour, minute] = startTime.split(':').map(Number);
    const classTime = new Date();
    classTime.setHours(hour, minute, 0, 0);

    if (now > classTime) return 'Concluída';
    if (now.getHours() === hour) return 'Em Andamento';
    return 'Agendada';
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Aulas de Hoje</CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.length > 0 ? (
            classes.map((cls, index) => {
              const status = getMockStatus(cls.start_time);
              return (
              <div key={index} className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex justify-between items-start">
                  <div>
                      <p className="font-semibold">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">{cls.start_time} - {cls.end_time}</p>
                  </div>
                  <Badge variant="outline" className={cn('font-medium', statusStyles[status])}>{status}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-md bg-green-50 border border-green-200">
                      <p className="font-bold text-green-700">0</p>
                      <p className="text-xs text-green-600">Presentes</p>
                  </div>
                  <div className="p-2 rounded-md bg-red-50 border border-red-200">
                      <p className="font-bold text-red-700">0</p>
                      <p className="text-xs text-red-600">Ausentes</p>
                  </div>
                  <div className="p-2 rounded-md bg-yellow-50 border border-yellow-200">
                      <p className="font-bold text-yellow-700">0</p>
                      <p className="text-xs text-yellow-600">Justificados</p>
                  </div>
                  </div>
              </div>
            )})
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <p>Nenhuma aula programada para hoje.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
