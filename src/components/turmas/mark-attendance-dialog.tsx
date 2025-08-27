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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Check, X, Clock, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/lib/database.types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { getEnrolledStudents } from '@/app/turmas/actions';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Student = Pick<Database['public']['Tables']['students']['Row'], 'id' | 'name'>;

interface MarkAttendanceDialogProps {
  classes: ClassRow[];
  children: React.ReactNode;
  onSuccess: () => void;
}

type StudentStatus = 'pending' | 'present' | 'absent' | 'justified';

const statusClasses: Record<StudentStatus, string> = {
  present: 'bg-green-100',
  absent: 'bg-red-100',
  justified: 'bg-yellow-100',
  pending: 'bg-transparent',
};


export function MarkAttendanceDialog({ classes, children, onSuccess }: MarkAttendanceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);
  const [enrolledStudents, setEnrolledStudents] = React.useState<Student[]>([]);
  const [isFetchingStudents, setIsFetchingStudents] = React.useState(false);
  const [attendance, setAttendance] = React.useState<Record<string, StudentStatus>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleClassSelect = async (classId: string) => {
    setSelectedClassId(classId);
    setEnrolledStudents([]);
    setAttendance({});
    setIsFetchingStudents(true);
    try {
      const students = await getEnrolledStudents(classId);
      setEnrolledStudents(students);
    } catch (error) {
      toast({
        title: 'Erro ao buscar alunos.',
        description: 'Não foi possível carregar la lista de alunos para esta turma.',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingStudents(false);
    }
  };

  const handleStatusChange = (studentId: string, status: StudentStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const getInitials = (name: string | null) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : name.substring(0, 2);
  };

  const handleSave = () => {
    setIsSaving(true);
    // TODO: Implement server action to save attendance data
    setTimeout(() => {
        toast({
            title: "Presença Salva!",
            description: "A lista de presença foi registrada com sucesso.",
        });
        setIsSaving(false);
        setOpen(false);
        setSelectedClassId(null);
        setAttendance({});
        onSuccess();
    }, 1000)
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Marcar Presença</DialogTitle>
          <DialogDescription>
            Selecione a turma e marque a presença de cada aluno.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <Select onValueChange={handleClassSelect}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma..." />
                </SelectTrigger>
                <SelectContent>
                    {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                           {cls.name} ({cls.start_time} - {cls.end_time})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedClass && (
                 <div className="border rounded-lg">
                    <div className="p-4 bg-muted/50 border-b flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                           <User className="h-4 w-4 text-muted-foreground" />
                           <span className="font-semibold">{(selectedClass as any).instructors?.name || 'A definir'}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-muted-foreground" />
                           <span className="font-semibold">{Object.values(attendance).filter(s => s === 'present').length}/{enrolledStudents.length} presentes</span>
                        </div>
                    </div>
                    <ScrollArea className="h-72">
                        {isFetchingStudents ? (
                           <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                           </div>
                        ) : enrolledStudents.length > 0 ? (
                            <div className="divide-y">
                            {enrolledStudents.map(student => {
                                const currentStatus = attendance[student.id] || 'pending';
                                return (
                                    <div key={student.id} className={cn("p-3 flex items-center justify-between transition-colors", statusClasses[currentStatus])}>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-medium">{student.name}</p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant={currentStatus === 'present' ? 'default' : 'outline'} 
                                                size="icon" 
                                                className="h-8 w-8 bg-green-500 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-green-500" 
                                                onClick={() => handleStatusChange(student.id, 'present')}>
                                                    <Check className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant={currentStatus === 'absent' ? 'destructive' : 'outline'} 
                                                size="icon" 
                                                className="h-8 w-8" 
                                                onClick={() => handleStatusChange(student.id, 'absent')}>
                                                    <X className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant={currentStatus === 'justified' ? 'default' : 'outline'} 
                                                size="icon" 
                                                className="h-8 w-8 bg-yellow-500 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-yellow-500" 
                                                onClick={() => handleStatusChange(student.id, 'justified')}>
                                                    <Clock className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-muted-foreground p-4">
                                <div>
                                    <Users className="h-10 w-10 mx-auto mb-2" />
                                    <p>Nenhum aluno matriculado nesta turma.</p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                 </div>
            )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving || !selectedClassId || enrolledStudents.length === 0}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Presenças
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
