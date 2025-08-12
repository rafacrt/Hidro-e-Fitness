
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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, User, Users, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStudents } from '@/app/alunos/actions';
import {
  enrollStudents,
  unenrollStudents,
  getEnrolledStudents,
} from '@/app/turmas/actions';
import type { Database } from '@/lib/database.types';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

type Student = Pick<Database['public']['Tables']['students']['Row'], 'id' | 'name'>;
type ClassRow = Database['public']['Tables']['classes']['Row'];

interface EnrollStudentsDialogProps {
  children: React.ReactNode;
  classes: ClassRow[];
  preselectedClassId?: string;
}

const getInitials = (name: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`
    : name.substring(0, 2);
};

export function EnrollStudentsDialog({
  children,
  classes,
  preselectedClassId,
}: EnrollStudentsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [allStudents, setAllStudents] = React.useState<Student[]>([]);
  const [enrolledStudents, setEnrolledStudents] = React.useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(
    preselectedClassId || null
  );
  const [toEnroll, setToEnroll] = React.useState<Set<string>>(new Set());
  const [toUnenroll, setToUnenroll] = React.useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const fetchAllStudents = React.useCallback(async () => {
    try {
      const studentData = await getStudents();
      setAllStudents(studentData as Student[]);
    } catch (error) {
       toast({ title: 'Erro ao buscar alunos.', variant: 'destructive' });
    }
  }, [toast]);
  
  const fetchEnrolledStudents = React.useCallback(async (classId: string) => {
    setIsLoading(true);
    try {
      const enrolledData = await getEnrolledStudents(classId);
      setEnrolledStudents(enrolledData);
    } catch (error) {
      toast({ title: 'Erro ao buscar alunos matriculados.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    if (open) {
      fetchAllStudents();
      if (preselectedClassId) {
        setSelectedClassId(preselectedClassId);
        fetchEnrolledStudents(preselectedClassId);
      }
    }
  }, [open, preselectedClassId, fetchAllStudents, fetchEnrolledStudents]);

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setToEnroll(new Set());
    setToUnenroll(new Set());
    fetchEnrolledStudents(classId);
  };
  
  const handleToggleEnroll = (studentId: string) => {
    setToEnroll(prev => {
        const newSet = new Set(prev);
        if (newSet.has(studentId)) {
            newSet.delete(studentId);
        } else {
            newSet.add(studentId);
        }
        return newSet;
    });
  };

  const handleToggleUnenroll = (studentId: string) => {
    setToUnenroll(prev => {
        const newSet = new Set(prev);
        if (newSet.has(studentId)) {
            newSet.delete(studentId);
        } else {
            newSet.add(studentId);
        }
        return newSet;
    });
  };

  const handleSave = async () => {
    if (!selectedClassId) return;
    setIsLoading(true);

    const enrollPromise = enrollStudents({ class_id: selectedClassId, student_ids: Array.from(toEnroll) });
    const unenrollPromise = unenrollStudents(selectedClassId, Array.from(toUnenroll));

    const [enrollResult, unenrollResult] = await Promise.all([enrollPromise, unenrollPromise]);
    
    if (enrollResult.success || unenrollResult.success) {
        toast({ title: 'Sucesso!', description: 'Matrículas atualizadas com sucesso.' });
        setToEnroll(new Set());
        setToUnenroll(new Set());
        fetchEnrolledStudents(selectedClassId);
    } else {
        if (!enrollResult.success) toast({ title: 'Erro ao matricular', description: enrollResult.message, variant: 'destructive' });
        if (!unenrollResult.success) toast({ title: 'Erro ao desmatricular', description: unenrollResult.message, variant: 'destructive' });
    }

    setIsLoading(false);
  };

  const availableStudents = React.useMemo(() => {
    const enrolledIds = new Set(enrolledStudents.map(s => s.id));
    return allStudents
      .filter(s => !enrolledIds.has(s.id))
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allStudents, enrolledStudents, searchTerm]);
  
  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Matricular Alunos</DialogTitle>
          <DialogDescription>
            Selecione alunos da lista para matricular ou desmatricular da turma.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <Select onValueChange={handleClassChange} value={selectedClassId || ''} disabled={!!preselectedClassId}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma..." />
                </SelectTrigger>
                <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
            
            {selectedClassId && (
                <div className="grid grid-cols-2 gap-6 items-start">
                    {/* Coluna de Alunos Disponíveis */}
                    <div className="border rounded-lg">
                        <div className="p-3 border-b">
                            <h3 className="font-semibold">Alunos Disponíveis</h3>
                            <div className="relative mt-2">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Buscar aluno..." 
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <ScrollArea className="h-72">
                            <div className="p-2 space-y-1">
                            {availableStudents.map(student => (
                                <div key={student.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                                    <Checkbox
                                        id={`enroll-${student.id}`}
                                        checked={toEnroll.has(student.id)}
                                        onCheckedChange={() => handleToggleEnroll(student.id)}
                                    />
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                    </Avatar>
                                    <label htmlFor={`enroll-${student.id}`} className="font-medium text-sm cursor-pointer">{student.name}</label>
                                </div>
                            ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Coluna de Alunos Matriculados */}
                    <div className="border rounded-lg">
                        <div className="p-3 border-b">
                            <h3 className="font-semibold">Alunos Matriculados ({enrolledStudents.length}/{selectedClass?.max_students})</h3>
                            <p className="text-sm text-muted-foreground">{selectedClass?.name}</p>
                        </div>
                         <ScrollArea className="h-72">
                             {isLoading ? (
                                <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin" /></div>
                             ) : (
                                <div className="p-2 space-y-1">
                                    {enrolledStudents.map(student => (
                                        <div key={student.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                                            <Checkbox
                                                id={`unenroll-${student.id}`}
                                                checked={toUnenroll.has(student.id)}
                                                onCheckedChange={() => handleToggleUnenroll(student.id)}
                                            />
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                            </Avatar>
                                            <label htmlFor={`unenroll-${student.id}`} className="font-medium text-sm cursor-pointer">{student.name}</label>
                                        </div>
                                    ))}
                                </div>
                             )}
                        </ScrollArea>
                    </div>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button onClick={handleSave} disabled={isLoading || (!toEnroll.size && !toUnenroll.size)}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
