import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '../ui/card';
import { Check, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const attendanceData = [
  {
    studentName: 'Maria Santos Silva',
    studentPhone: '(11) 99999-8888',
    studentAvatar: 'https://placehold.co/40x40.png',
    studentAvatarHint: 'woman portrait',
    className: 'Natação Adulto - Iniciante',
    classTime: '08:00 - 09:00 - Prof. Ana Silva',
    status: 'Presente',
    checkIn: '08:05',
    observations: '-',
  },
  {
    studentName: 'João Pedro Costa',
    studentPhone: '(11) 88888-7777',
    studentAvatar: 'https://placehold.co/40x40.png',
    studentAvatarHint: 'man portrait',
    className: 'Natação Adulto - Iniciante',
    classTime: '08:00 - 09:00 - Prof. Ana Silva',
    status: 'Ausente',
    checkIn: '-',
    observations: 'Avisou que não viria',
  },
  {
    studentName: 'Ana Clara Oliveira',
    studentPhone: '(11) 77777-6666',
    studentAvatar: 'https://placehold.co/40x40.png',
    studentAvatarHint: 'woman portrait',
    className: 'Natação Adulto - Iniciante',
    classTime: '08:00 - 09:00 - Prof. Ana Silva',
    status: 'Presente',
    checkIn: '07:58',
    observations: '-',
  },
  {
    studentName: 'Carlos Eduardo Lima',
    studentPhone: '(11) 66666-5555',
    studentAvatar: 'https://placehold.co/40x40.png',
    studentAvatarHint: 'man portrait',
    className: 'Hidroginástica',
    classTime: '09:00 - 10:00 - Prof. Carlos Santos',
    status: 'Presente',
    checkIn: '09:02',
    observations: '-',
  },
  {
    studentName: 'Fernanda Souza',
    studentPhone: '(11) 55555-4444',
    studentAvatar: 'https://placehold.co/40x40.png',
    studentAvatarHint: 'woman portrait',
    className: 'Hidroginástica',
    classTime: '09:00 - 10:00 - Prof. Carlos Santos',
    status: 'Justificado',
    checkIn: '-',
    observations: 'Atestado médico',
  },
];

const statusStyles: { [key: string]: string } = {
  Presente: 'bg-green-100 text-green-800 border-green-200',
  Ausente: 'bg-red-100 text-red-800 border-red-200',
  Justificado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

export default function AttendanceTable() {
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={item.studentAvatar} alt={item.studentName} data-ai-hint={item.studentAvatarHint} />
                      <AvatarFallback>{getInitials(item.studentName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.studentName}</p>
                      <p className="text-sm text-muted-foreground">{item.studentPhone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{item.className}</p>
                  <p className="text-sm text-muted-foreground">{item.classTime}</p>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className={cn("font-medium", statusStyles[item.status])}>
                     <div className="flex items-center gap-1.5">
                        {item.status === 'Presente' && <Check className="h-3 w-3" />}
                        {item.status === 'Ausente' && <X className="h-3 w-3" />}
                        {item.status === 'Justificado' && <Clock className="h-3 w-3" />}
                        {item.status}
                     </div>
                  </Badge>
                </TableCell>
                <TableCell>
                    {item.checkIn !== '-' ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{item.checkIn}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">{item.checkIn}</span>
                    )}
                </TableCell>
                <TableCell>
                    <span className="text-muted-foreground">{item.observations}</span>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700">
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                            <X className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-600">
                            <Clock className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
