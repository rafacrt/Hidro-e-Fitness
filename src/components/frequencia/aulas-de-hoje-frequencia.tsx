import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const classes = [
  { 
    title: 'Natação Adulto - Iniciante', 
    time: '08:00 - 09:00 - Prof. Ana Silva', 
    present: 13, 
    absent: 2, 
    justified: 0, 
    total: 15, 
    presence: 86.7, 
    status: 'Concluída' 
  },
  { 
    title: 'Hidroginástica', 
    time: '09:00 - 10:00 - Prof. Carlos Santos', 
    present: 18, 
    absent: 1, 
    justified: 1, 
    total: 20, 
    presence: 90.0, 
    status: 'Em Andamento' 
  },
  { 
    title: 'Natação Infantil', 
    time: '10:00 - 11:00 - Prof. Marina Costa', 
    total: 10,
    status: 'Agendada' 
  },
  { 
    title: 'Aqua Aeróbica', 
    time: '14:00 - 15:00 - Prof. Roberto Lima', 
    total: 18, 
    status: 'Agendada' 
  },
];

const statusStyles: { [key: string]: string } = {
    'Concluída': 'bg-green-100 text-green-800 border-green-200',
    'Em Andamento': 'bg-blue-100 text-blue-800 border-blue-200',
    'Agendada': 'bg-zinc-100 text-zinc-800 border-zinc-200',
};

export default function AulasDeHojeFrequencia() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Aulas de Hoje</CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.map((cls, index) => (
          <div key={index} className="p-4 rounded-lg bg-secondary/50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{cls.title}</p>
                <p className="text-sm text-muted-foreground">{cls.time}</p>
              </div>
              <Badge variant="outline" className={cn('font-medium', statusStyles[cls.status])}>{cls.status}</Badge>
            </div>
            {cls.status !== 'Agendada' ? (
              <>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-md bg-green-50 border border-green-200">
                    <p className="font-bold text-green-700">{cls.present}</p>
                    <p className="text-xs text-green-600">Presentes</p>
                  </div>
                  <div className="p-2 rounded-md bg-red-50 border border-red-200">
                    <p className="font-bold text-red-700">{cls.absent}</p>
                    <p className="text-xs text-red-600">Ausentes</p>
                  </div>
                  <div className="p-2 rounded-md bg-yellow-50 border border-yellow-200">
                    <p className="font-bold text-yellow-700">{cls.justified}</p>
                    <p className="text-xs text-yellow-600">Justificados</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-right">
                  <span className="font-semibold">{cls.presence}%</span>
                  <span className="text-muted-foreground"> de presença</span>
                </div>
              </>
            ) : (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>{cls.total} alunos matriculados</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
