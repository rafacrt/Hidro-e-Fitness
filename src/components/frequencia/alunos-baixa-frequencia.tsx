import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

const students = [
  { 
    name: 'João Silva Santos', 
    modality: 'Natação Adulto',
    absences: 8,
    totalClasses: 20,
    lastPresence: '09/01/2024',
    presenceRate: 60,
  },
  { 
    name: 'Maria Oliveira', 
    modality: 'Hidroginástica',
    absences: 6,
    totalClasses: 18,
    lastPresence: '11/01/2024',
    presenceRate: 66.7,
  },
  { 
    name: 'Pedro Costa', 
    modality: 'Natação Infantil',
    absences: 5,
    totalClasses: 15,
    lastPresence: '07/01/2024',
    presenceRate: 66.7,
  },
];

export default function AlunosBaixaFrequencia() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <CardTitle>Alunos com Baixa Frequência</CardTitle>
        </div>
        <Button variant="ghost" size="icon">
            <AlertCircle className="h-5 w-5 text-red-500" />
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {students.map((student, index) => (
          <div key={index} className="p-4 rounded-lg border bg-card shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.modality}</p>
                </div>
                <Badge variant="destructive" className="text-sm font-semibold">{student.presenceRate.toFixed(1)}%</Badge>
            </div>
            <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Faltas:</span>
                    <span className="font-medium">{student.absences}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Total de aulas:</span>
                    <span className="font-medium">{student.totalClasses}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Última presença:</span>
                    <span className="font-medium">{student.lastPresence}</span>
                </div>
            </div>
            <Progress value={student.presenceRate} className="mt-3 h-2" indicatorClassName='bg-red-500' />

            <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">Ver Histórico</Button>
                <Button size="sm">Contatar</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
