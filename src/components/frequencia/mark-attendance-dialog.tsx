
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

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Instructor = Database['public']['Tables']['instructors']['Row'];
type UpcomingClass = ClassRow & { instructors: Pick<Instructor, 'name'> | null };

interface MarkAttendanceDialogProps {
  classes: UpcomingClass[];
  children: React.ReactNode;
  onSuccess: () => void;
}

// Mock student data for demonstration
const mockStudents = [
  { id: '1', name: 'Ana Silva', avatar: 'AS', status: 'pending' },
  { id: '2', name: 'Bruno Costa', avatar: 'BC', status: 'pending' },
  { id: '3', name: 'Carla Dias', avatar: 'CD', status: 'pending' },
  { id: '4', name: 'Daniel Martins', avatar: 'DM', status: 'pending' },
  { id: '5', name: 'Eduarda Ferreira', avatar: 'EF', status: 'pending' },
  { id: '6', name: 'Fernando Gomes', avatar: 'FG', status: 'pending' },
  { id: '7', name: 'Gabriela Lima', avatar: 'GL', status: 'pending' },
];

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
  const [attendance, setAttendance] = React.useState<Record<string, StudentStatus>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setAttendance({}); // Reset attendance when class changes
  };

  const handleStatusChange = (studentId: string, status: StudentStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
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
                           <span className="font-semibold">{selectedClass.instructors?.name}</span>
                        </div>
                         <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-muted-foreground" />
                           <span className="font-semibold">{Object.values(attendance).filter(s => s === 'present').length}/{mockStudents.length} presentes</span>
                        </div>
                    </div>
                    <ScrollArea className="h-72">
                        <div className="divide-y">
                        {mockStudents.map(student => {
                            const currentStatus = attendance[student.id] || 'pending';
                            return (
                                <div key={student.id} className={cn("p-3 flex items-center justify-between transition-colors", statusClasses[currentStatus])}>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{student.avatar}</AvatarFallback>
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
          <Button onClick={handleSave} disabled={isSaving || !selectedClassId}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Presenças
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
