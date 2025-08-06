
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Calendar } from 'lucide-react';
import type { Database } from '@/lib/database.types';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type UpcomingClass = ClassRow & { instructors: Pick<Instructor, 'name'> | null };

interface ControlePresencaTabProps {
  classes: UpcomingClass[];
}

// Mock student data for demonstration
const mockStudents = [
  { id: '1', name: 'Ana Silva', avatar: 'AS', status: 'pending' },
  { id: '2', name: 'Bruno Costa', avatar: 'BC', status: 'pending' },
  { id: '3', name: 'Carla Dias', avatar: 'CD', status: 'pending' },
  { id: '4', name: 'Daniel Martins', avatar: 'DM', status: 'pending' },
  { id: '5', name: 'Eduarda Ferreira', avatar: 'EF', status: 'pending' },
];

type StudentStatus = 'pending' | 'present' | 'absent' | 'justified';

const statusClasses = {
  present: 'bg-green-100 hover:bg-green-200',
  absent: 'bg-red-100 hover:bg-red-200',
  justified: 'bg-yellow-100 hover:bg-yellow-200',
  pending: 'bg-zinc-100 hover:bg-zinc-200',
};


export default function ControlePresencaTab({ classes }: ControlePresencaTabProps) {
  const [attendance, setAttendance] = React.useState<Record<string, Record<string, StudentStatus>>>({});

  const handleStatusChange = (classId: string, studentId: string, status: StudentStatus) => {
    setAttendance(prev => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        [studentId]: status,
      },
    }));
  };

  if (classes.length === 0) {
    return (
        <Card>
            <CardContent className="h-96 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Nenhuma aula hoje</h3>
                <p className="text-sm">Não há turmas agendadas para o dia de hoje.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle de Presença - Aulas de Hoje</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue={`class-0`}>
          {classes.map((cls, index) => (
            <AccordionItem value={`class-${index}`} key={cls.id}>
              <AccordionTrigger className="hover:bg-accent px-4 rounded-md">
                <div className="flex justify-between w-full items-center">
                    <div>
                        <p className="font-semibold">{cls.name}</p>
                        <p className="text-sm text-muted-foreground font-normal">{cls.start_time} - {cls.end_time} | {cls.instructors?.name}</p>
                    </div>
                     <div className="text-sm text-muted-foreground mr-4">
                        0/{mockStudents.length} presentes
                    </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="border-t">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aluno</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockStudents.map(student => {
                                const currentStatus = attendance[cls.id]?.[student.id] || 'pending';
                                return (
                                <TableRow key={student.id} className={statusClasses[currentStatus]}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{student.avatar}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-medium">{student.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant={currentStatus === 'present' ? 'default' : 'outline'} size="icon" className="h-8 w-8 bg-green-500 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-500" onClick={() => handleStatusChange(cls.id, student.id, 'present')}><Check className="h-4 w-4" /></Button>
                                            <Button variant={currentStatus === 'absent' ? 'destructive' : 'outline'} size="icon" className="h-8 w-8" onClick={() => handleStatusChange(cls.id, student.id, 'absent')}><X className="h-4 w-4" /></Button>
                                            <Button variant={currentStatus === 'justified' ? 'default' : 'outline'} size="icon" className="h-8 w-8 bg-yellow-500 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-yellow-500" onClick={() => handleStatusChange(cls.id, student.id, 'justified')}><Clock className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
