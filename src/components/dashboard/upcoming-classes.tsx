
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Menu, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type UpcomingClass = ClassRow & { instructors: Pick<Instructor, 'name'> | null };

interface UpcomingClassesProps {
  classes: UpcomingClass[];
}

export default function UpcomingClasses({ classes }: UpcomingClassesProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Próximas Turmas de Hoje</CardTitle>
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.length > 0 ? (
            classes.map((cls, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg">
                <div className="flex-grow">
                <p className="font-semibold">{cls.name}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>{cls.start_time} - {cls.end_time}</span>
                    <span className="mx-2">•</span>
                    <span>{cls.instructors?.name || 'Professor a definir'}</span>
                </div>
                </div>
                <div className="text-right">
                <p className="text-sm font-medium">0/{cls.max_students}</p>
                <p className="text-xs text-muted-foreground">alunos</p>
                </div>
            </div>
            ))
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <p>Nenhuma turma agendada para hoje.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
