import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Menu } from 'lucide-react';
import { Button } from '../ui/button';

const classes = [
  {
    title: 'Natação Adulto - Iniciante',
    time: '08:00',
    instructor: 'Prof. Ana Silva',
    students: '12/15',
    progress: 12 / 15 * 100,
  },
  {
    title: 'Hidroginástica',
    time: '09:00',
    instructor: 'Prof. Carlos Santos',
    students: '18/20',
    progress: 18 / 20 * 100,
  },
  {
    title: 'Natação Infantil',
    time: '10:00',
    instructor: 'Prof. Marina Costa',
    students: '8/10',
    progress: 8 / 10 * 100,
  },
];

export default function UpcomingClasses() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Próximas Turmas</CardTitle>
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.map((cls, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-secondary/50 rounded-lg">
            <div className="flex-grow">
              <p className="font-semibold">{cls.title}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>{cls.time}</span>
                <span className="mx-2">•</span>
                <span>{cls.instructor}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{cls.students}</p>
              <p className="text-xs text-muted-foreground">alunos</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
