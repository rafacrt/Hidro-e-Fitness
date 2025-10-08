
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn, validateCPF } from '@/lib/utils';
import { CalendarIcon, CircleX, Loader2, Save } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IMaskInput } from 'react-imask';
import { WaveSpinner } from '../ui/wave-spinner';
import { updateStudent } from '@/app/alunos/actions';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/lib/database.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DialogCancelButton, DialogClose, DialogSubmitButton } from '../ui/dialog';

type Student = Database['public']['Tables']['students']['Row'];

interface EditStudentFormProps {
    student: Student;
    children: React.ReactNode;
    onSuccess: () => void;
}

const studentFormSchema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório.'),
    cpf: z.string().optional().refine((val) => val ? validateCPF(val) : true, { message: "CPF inválido." }),
    birthDate: z.date({
      errorMap: (issue, ctx) => {
        if (issue.code === 'invalid_date') {
          return { message: 'Data de nascimento inválida.' };
        }
        return { message: ctx.defaultError };
      },
    }).optional(),
    email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
    phone: z.string().optional(),
    isWhatsApp: z.boolean().default(false),
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    responsibleName: z.string().optional(),
    responsiblePhone: z.string().optional(),
    medicalObservations: z.string().optional(),
    status: z.enum(['ativo', 'inativo']).default('ativo'),
  })
  .refine(
    (data) => {
      if (data.birthDate) {
        const today = new Date();
        const birthDate = new Date(data.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          return !!data.responsibleName && !!data.responsiblePhone;
        }
      }
      return true;
    },
    {
      message: 'Nome e telefone do responsável são obrigatórios para menores de 18 anos.',
      path: ['responsibleName'],
    }
  );

type StudentFormValues = z.infer<typeof studentFormSchema>;

export function EditStudentForm({ student, children, onSuccess }: EditStudentFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isMinor, setIsMinor] = React.useState(false);
  const [isFetchingCep, setIsFetchingCep] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
        name: student.name,
        cpf: student.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '',
        birthDate: student.birth_date ? new Date(student.birth_date) : undefined,
        email: student.email || '',
        phone: student.phone || '',
        isWhatsApp: student.is_whatsapp || false,
        cep: student.cep?.replace(/(\d{5})(\d{3})/, '$1-$2') || '',
        street: student.street || '',
        number: student.number || '',
        complement: student.complement || '',
        neighborhood: student.neighborhood || '',
        city: student.city || '',
        state: student.state || '',
        responsibleName: student.responsible_name || '',
        responsiblePhone: student.responsible_phone || '',
        medicalObservations: student.medical_observations || '',
        status: student.status === 'ativo' ? 'ativo' : 'inativo',
    },
  });

  const watchBirthDate = form.watch('birthDate');

  React.useEffect(() => {
    if (watchBirthDate) {
      const today = new Date();
      const birthDate = new Date(watchBirthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setIsMinor(age < 18);
    } else {
      setIsMinor(false);
    }
  }, [watchBirthDate]);

  const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const cep = event.target.value.replace(/\D/g, '');
    form.setValue('cep', cep);

    if (cep.length === 8) {
      setIsFetchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          form.setValue('street', data.logradouro);
          form.setValue('neighborhood', data.bairro);
          form.setValue('city', data.localidade);
          form.setValue('state', data.uf);
          form.setFocus('number');
        } else {
          toast({ title: 'CEP não encontrado', variant: 'destructive' });
        }
      } catch (error) {
        toast({ title: 'Erro ao buscar CEP', variant: 'destructive' });
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const onSubmit = async (data: StudentFormValues) => {
    const result = await updateStudent(student.id, data);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      setOpen(false);
      onSuccess();
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
       form.reset({
        name: student.name,
        cpf: student.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '',
        birthDate: student.birth_date ? new Date(student.birth_date) : undefined,
        email: student.email || '',
        phone: student.phone || '',
        isWhatsApp: student.is_whatsapp || false,
        cep: student.cep?.replace(/(\d{5})(\d{3})/, '$1-$2') || '',
        street: student.street || '',
        number: student.number || '',
        complement: student.complement || '',
        neighborhood: student.neighborhood || '',
        city: student.city || '',
        state: student.state || '',
        responsibleName: student.responsible_name || '',
        responsiblePhone: student.responsible_phone || '',
        medicalObservations: student.medical_observations || '',
        status: student.status === 'ativo' ? 'ativo' : 'inativo',
    });
    }
  }


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Aluno</DialogTitle>
          <DialogDescription>
            Atualize os dados do aluno. Clique em salvar para aplicar as alterações.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-1">
              <h3 className="text-lg font-medium">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF (Opcional)</FormLabel>
                      <FormControl>
                        <IMaskInput
                          mask="000.000.000-00"
                          value={field.value || ''}
                          unmask={true}
                          onAccept={(value) => field.onChange(value)}
                          className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                          placeholder="000.000.000-00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento (Opcional)</FormLabel>
                       <Popover>
                          <div className="relative flex items-center">
                            <FormControl>
                              <IMaskInput
                                mask="00/00/0000"
                                value={field.value ? format(field.value, 'dd/MM/yyyy') : ''}
                                unmask={false} // Mantém a máscara para exibição
                                onAccept={(_value, mask) => {
                                  const parsedDate = parse(mask.unmaskedValue, 'ddMMyyyy', new Date());
                                  if (!isNaN(parsedDate.getTime()) && mask.unmaskedValue.length === 8) {
                                    form.setValue('birthDate', parsedDate, { shouldValidate: true });
                                  } else if (!mask.unmaskedValue) {
                                    form.setValue('birthDate', undefined, { shouldValidate: true });
                                  }
                                }}
                                className={cn(
                                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                                )}
                                placeholder="dd/mm/aaaa"
                              />
                            </FormControl>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="absolute right-1 h-8 w-8 p-0">
                                <span className="sr-only">Abrir calendário</span>
                                <CalendarIcon className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                          </div>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              fromYear={1920}
                              toYear={new Date().getFullYear()}
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                              }}
                              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="exemplo@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (Opcional)</FormLabel>
                      <FormControl>
                         <IMaskInput
                          mask="(00) 00000-0000"
                          value={field.value || ''}
                          unmask={true}
                          onAccept={(value) => field.onChange(value)}
                          className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                          placeholder="(99) 99999-9999"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isWhatsApp"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-8">
                      <FormLabel className="mb-0">É WhatsApp?</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {isMinor && (
                 <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium text-yellow-600">Dados do Responsável</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="responsibleName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Responsável</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do responsável" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="responsiblePhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone do Responsável</FormLabel>
                                    <FormControl>
                                       <IMaskInput
                                          mask="(00) 00000-0000"
                                          value={field.value || ''}
                                          unmask={true}
                                          onAccept={(value) => field.onChange(value)}
                                          className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                                          placeholder="(99) 99999-9999"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Endereço (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                         <div className="relative">
                           <IMaskInput
                            mask="00000-000"
                            value={field.value || ''}
                            unmask={true}
                            onAccept={(value) => {
                                field.onChange(value);
                                const cep = (value as string).replace(/\D/g, '');
                                if (cep.length === 8) {
                                  handleCepChange({ target: { value: cep } } as React.ChangeEvent<HTMLInputElement>);
                                }
                              }}
                            className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm')}
                            placeholder="00000-000"
                           />
                           {isFetchingCep && (<div className="absolute inset-y-0 right-0 flex items-center pr-3"><WaveSpinner className="h-5 w-5 text-primary" /></div>)}
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="street" render={({ field }) => (<FormItem className="col-span-3"><FormLabel>Rua</FormLabel><FormControl><Input placeholder="Ex: Rua das Flores" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="number" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Número</FormLabel><FormControl><Input placeholder="Ex: 123" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="complement" render={({ field }) => (<FormItem className="col-span-1"><FormLabel>Complemento</FormLabel><FormControl><Input placeholder="Ex: Apto 101" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="neighborhood" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Bairro</FormLabel><FormControl><Input placeholder="Ex: Centro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="city" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Cidade</FormLabel><FormControl><Input placeholder="Ex: São Paulo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="state" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Estado</FormLabel><FormControl><Input placeholder="Ex: SP" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>

             <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Outras Informações</h3>
                 <FormField
                  control={form.control}
                  name="medicalObservations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Médicas (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Alergias, condições médicas, etc." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status do aluno" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
              <DialogCancelButton />
              <DialogSubmitButton disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Salvar Alterações'}
              </DialogSubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
