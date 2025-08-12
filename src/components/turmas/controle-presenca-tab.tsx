
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
import { Check, X, Clock, Calendar, Users, Loader2 } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { getEnrolledStudents } from '@/app/turmas/actions';
import { useToast } from '@/hooks/use-toast';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type UpcomingClass = ClassRow & { instructors: Pick<Instructor, 'name'> | null };
type Student = Pick<Database['public']['Tables']['students']['Row'], 'id' | 'name'>;


interface ControlePresencaTabProps {
  classes: UpcomingClass[];
}

type StudentStatus = 'pending' | 'present' | 'absent' | 'justified';

const statusClasses = {
  present: 'bg-green-100 hover:bg-green-200',
  absent: 'bg-red-100 hover:bg-red-200',
  justified: 'bg-yellow-100 hover:bg-yellow-200',
  pending: 'bg-zinc-100 hover:bg-zinc-200',
};

const getInitials = (name: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`
    : name.substring(0, 2);
};

function ClassAttendance({ cls, index }: { cls: UpcomingClass; index: number }) {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetched, setIsFetched] = React.useState(false);
  const { toast } = useToast();
  const [attendance, setAttendance] = React.useState<Record<string, StudentStatus>>({});

  const handleFetchStudents = async () => {
    if (isFetched) return;
    setIsLoading(true);
    try {
      const fetchedStudents = await getEnrolledStudents(cls.id);
      setStudents(fetchedStudents);
      setIsFetched(true);
    } catch (error) {
      toast({
        title: 'Erro ao buscar alunos',
        description: 'Não foi possível carregar a lista de alunos para esta turma.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: StudentStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;

  return (
    <AccordionItem value={`class-${index}`}>
      <AccordionTrigger
        className="hover:bg-accent px-4 rounded-md"
        onClick={handleFetchStudents}
      >
        <div className="flex justify-between w-full items-center">
          <div>
            <p className="font-semibold">{cls.name}</p>
            <p className="text-sm text-muted-foreground font-normal">
              {cls.start_time} - {cls.end_time} | {cls.instructors?.name || 'A definir'}
            </p>
          </div>
          <div className="text-sm text-muted-foreground mr-4">
            {presentCount}/{students.length} presentes
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <div className="border-t">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoading && students.length === 0 && isFetched && (
             <div className="text-center text-muted-foreground p-8">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhum aluno matriculado nesta turma.</p>
            </div>
          )}
          {!isLoading && students.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => {
                  const currentStatus = attendance[student.id] || 'pending';
                  return (
                    <TableRow key={student.id} className={statusClasses[currentStatus]}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{student.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant={currentStatus === 'present' ? 'default' : 'outline'} size="icon" className="h-8 w-8 bg-green-500 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-500" onClick={() => handleStatusChange(student.id, 'present')}><Check className="h-4 w-4" /></Button>
                          <Button variant={currentStatus === 'absent' ? 'destructive' : 'outline'} size="icon" className="h-8 w-8" onClick={() => handleStatusChange(student.id, 'absent')}><X className="h-4 w-4" /></Button>
                          <Button variant={currentStatus === 'justified' ? 'default' : 'outline'} size="icon" className="h-8 w-8 bg-yellow-500 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-yellow-500" onClick={() => handleStatusChange(student.id, 'justified')}><Clock className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}


export default function ControlePresencaTab({ classes }: ControlePresencaTabProps) {
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
            <ClassAttendance key={cls.id} cls={cls} index={index} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
