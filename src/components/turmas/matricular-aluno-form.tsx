
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getClasses, enrollStudent } from '@/app/turmas/actions';
import { getStudents } from '@/app/alunos/actions';
import type { Database } from '@/lib/database.types';

type Student = Database['public']['Tables']['students']['Row'];
type ClassRow = Database['public']['Tables']['classes']['Row'];

interface MatricularAlunoFormProps {
  children: React.ReactNode;
  preselectedClassId?: string;
}

const enrollStudentSchema = z.object({
  student_id: z.string({ required_error: 'Selecione um aluno.' }),
  class_id: z.string({ required_error: 'Selecione uma turma.' }),
});

type EnrollStudentFormValues = z.infer<typeof enrollStudentSchema>;

export function MatricularAlunoForm({ children, preselectedClassId }: MatricularAlunoFormProps) {
  const [open, setOpen] = React.useState(false);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [classes, setClasses] = React.useState<ClassRow[]>([]);
  const { toast } = useToast();

  const form = useForm<EnrollStudentFormValues>({
    resolver: zodResolver(enrollStudentSchema),
    defaultValues: {
      class_id: preselectedClassId,
    },
  });

  React.useEffect(() => {
    async function fetchData() {
      const [studentData, classData] = await Promise.all([
        getStudents(),
        getClasses(),
      ]);
      setStudents(studentData);
      setClasses(classData as any);
    }
    if (open) {
      fetchData();
    }
  }, [open]);
  
  React.useEffect(() => {
    if (preselectedClassId) {
      form.setValue('class_id', preselectedClassId);
    }
  }, [preselectedClassId, form]);

  const onSubmit = async (data: EnrollStudentFormValues) => {
    const result = await enrollStudent(data);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      setOpen(false);
      form.reset();
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => { e.stopPropagation(); setOpen(true); }}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Matricular Aluno em Turma</DialogTitle>
          <DialogDescription>
            Selecione o aluno e a turma para realizar a matrícula.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aluno</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um aluno..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={!!preselectedClassId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma turma..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Matricular
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
