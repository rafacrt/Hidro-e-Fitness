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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addClass, getInstructorsForForm, getModalitiesForForm } from '@/app/turmas/actions';
import type { Database } from '@/lib/database.types';

type Instructor = Database['public']['Tables']['instructors']['Row'];
type Modality = Database['public']['Tables']['modalities']['Row'];

const classFormSchema = z.object({
  name: z.string().min(3, 'O nome da turma deve ter pelo menos 3 caracteres.'),
  modality_id: z.string({ required_error: 'Selecione uma modalidade.' }),
  instructor_id: z.string().optional(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido.'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido.'),
  days_of_week: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Você deve selecionar pelo menos um dia da semana.',
  }),
  location: z.string().optional(),
  max_students: z.coerce.number().min(1, 'A turma deve ter pelo menos 1 vaga.'),
  status: z.enum(['ativa', 'inativa', 'lotada']).default('ativa'),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface AddClassFormProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const locations = ['Piscina 1', 'Piscina 2', 'Piscina Terapêutica'];
const weekdays = [
  { id: 'Segunda', label: 'Segunda' },
  { id: 'Terça', label: 'Terça' },
  { id: 'Quarta', label: 'Quarta' },
  { id: 'Quinta', label: 'Quinta' },
  { id: 'Sexta', label: 'Sexta' },
  { id: 'Sábado', label: 'Sábado' },
];

export function AddClassForm({ children, onSuccess }: AddClassFormProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [instructors, setInstructors] = React.useState<Pick<Instructor, 'id' | 'name'>[]>([]);
  const [modalities, setModalities] = React.useState<Pick<Modality, 'id' | 'name'>[]>([]);
  const [loading, setLoading] = React.useState({ instructors: false, modalities: false });

  React.useEffect(() => {
    if (open) {
      setLoading({ instructors: true, modalities: true });
      Promise.all([getInstructorsForForm(), getModalitiesForForm()])
        .then(([instructorsData, modalitiesData]) => {
          setInstructors(instructorsData);
          setModalities(modalitiesData);
          setLoading({ instructors: false, modalities: false });
        })
        .catch(() => {
          toast({ title: "Erro ao carregar dados", description: "Não foi possível buscar professores e modalidades.", variant: "destructive" });
          setLoading({ instructors: false, modalities: false });
        });
    }
  }, [open, toast]);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      days_of_week: [],
      max_students: 10,
      status: 'ativa',
    },
  });

  const onSubmit = async (data: ClassFormValues) => {
    const result = await addClass(data);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      setOpen(false);
      form.reset();
      onSuccess?.();
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Turma</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar uma nova turma ao sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Turma</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Natação Adulto - Manhã" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="modality_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading.modalities}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loading.modalities ? "Carregando..." : "Selecione..."} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {modalities.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading.instructors}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loading.instructors ? "Carregando..." : "Selecione..."} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {instructors.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Horário de Início</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Horário de Fim</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="days_of_week"
                render={() => (
                    <FormItem>
                        <FormLabel>Dias da Semana</FormLabel>
                        <div className="flex flex-wrap gap-4">
                        {weekdays.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="days_of_week"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.label)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.label])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.label
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
                />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Local</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="max_students"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Máximo de Alunos</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                    Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Turma
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
