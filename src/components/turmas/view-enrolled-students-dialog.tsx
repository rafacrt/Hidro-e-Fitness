
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Users, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEnrolledStudents } from '@/app/turmas/actions';
import type { Database } from '@/lib/database.types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Student = Pick<Database['public']['Tables']['students']['Row'], 'id' | 'name'>;

interface ViewEnrolledStudentsDialogProps {
  children: React.ReactNode;
  classData: ClassRow;
}

const getInitials = (name: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`
    : name.substring(0, 2);
};

export function ViewEnrolledStudentsDialog({ children, classData }: ViewEnrolledStudentsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [enrolledStudents, setEnrolledStudents] = React.useState<Student[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const fetchEnrolled = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const students = await getEnrolledStudents(classData.id);
      setEnrolledStudents(students);
    } catch (error) {
      toast({
        title: 'Erro ao buscar alunos',
        description: 'Não foi possível carregar a lista de alunos matriculados.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [classData.id, toast]);

  React.useEffect(() => {
    if (open) {
      fetchEnrolled();
    }
  }, [open, fetchEnrolled]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alunos Matriculados</DialogTitle>
          <DialogDescription>
            Lista de alunos matriculados na turma "{classData.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <div className="p-3 bg-secondary rounded-md text-center mb-4">
                <p className="text-sm text-secondary-foreground">Ocupação</p>
                <p className="text-2xl font-bold">{enrolledStudents.length} / {classData.max_students}</p>
            </div>
            <ScrollArea className="h-72 border rounded-lg">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : enrolledStudents.length > 0 ? (
                     <div className="p-2 space-y-1">
                        {enrolledStudents.map(student => (
                            <div key={student.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium text-sm">{student.name}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                    <UserX className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Users className="h-10 w-10 mb-2" />
                        <p>Nenhum aluno matriculado nesta turma.</p>
                    </div>
                )}
            </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
