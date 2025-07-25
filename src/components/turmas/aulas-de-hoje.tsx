import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const classes = [
  { title: 'Natação Adulto - Iniciante', time: '08:00 - 09:00', instructor: 'Prof. Ana Silva', status: 'Aguardando', students: '12/15' },
  { title: 'Hidroginástica', time: '09:00 - 10:00', instructor: 'Prof. Carlos Santos', status: 'Em Andamento', students: '18/20', statusVariant: 'default' },
  { title: 'Natação Infantil', time: '10:00 - 11:00', instructor: 'Prof. Marina Costa', status: 'Concluída', students: '8/10' },
  { title: 'Aqua Aeróbica', time: '14:00 - 15:00', instructor: 'Prof. Roberto Lima', status: 'Aguardando', students: '11/15' },
];

const statusStyles: { [key: string]: string } = {
    'Aguardando': 'bg-blue-100 text-blue-800 border-blue-200',
    'Em Andamento': 'bg-green-100 text-green-800 border-green-200',
    'Concluída': 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function AulasDeHoje() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aulas de Hoje</CardTitle>
        <CardDescription>Todas as aulas do dia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.map((cls, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-grow">
              <div className='flex items-center justify-between'>
                <p className="font-semibold">{cls.title}</p>
                <Badge variant="outline" className={statusStyles[cls.status]}>{cls.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{cls.time} - {cls.instructor}</p>
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
