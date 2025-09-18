
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn, validateCPF } from '@/lib/utils';
import { CalendarIcon, Loader2, DollarSign } from 'lucide-react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IMaskInput } from 'react-imask';
import { WaveSpinner } from '../ui/wave-spinner';
import { addStudent } from '@/app/alunos/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getClasses } from '@/app/turmas/actions';
import { getPlans } from '@/app/modalidades/actions';
import type { Database } from '@/lib/database.types';
import { Checkbox } from '../ui/checkbox';

type ClassRow = Database['public']['Tables']['classes']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'];
const paymentMethods = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto'];

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
    class_id: z.string().optional(),
    plan_ids: z.array(z.string()).optional(),
    payment_method: z.string().optional(),
    initial_payment_amount: z.string().optional(),
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

interface AddStudentFormProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const formatCurrencyForInput = (value: number | null) => {
    if (value === null || typeof value === 'undefined') return '';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value).replace('R$', 'R$ ');
}

export function AddStudentForm({ children, onSuccess }: AddStudentFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isMinor, setIsMinor] = React.useState(false);
  const [isFetchingCep, setIsFetchingCep] = React.useState(false);
  const [classes, setClasses] = React.useState<ClassRow[]>([]);
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loadingData, setLoadingData] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      isWhatsApp: true,
      plan_ids: [],
    },
  });

  React.useEffect(() => {
    if (open) {
      setLoadingData(true);
      Promise.all([getClasses(), getPlans()])
        .then(([classesData, plansData]) => {
          setClasses(classesData as ClassRow[]);
          setPlans(plansData as Plan[]);
        })
        .catch(() => toast({ title: 'Erro', description: 'Não foi possível carregar as turmas e planos.', variant: 'destructive' }))
        .finally(() => setLoadingData(false));
    }
  }, [open, toast]);

  const watchBirthDate = form.watch('birthDate');
  const watchPlanIds = form.watch('plan_ids');

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

  React.useEffect(() => {
    if (plans.length > 0 && watchPlanIds && watchPlanIds.length > 0) {
        const selectedPlans = plans.filter(p => watchPlanIds.includes(p.id));
        const total = selectedPlans.reduce((sum, p) => sum + (p.price || 0), 0);
        form.setValue('initial_payment_amount', formatCurrencyForInput(total));
    } else {
        form.setValue('initial_payment_amount', '');
    }
  }, [watchPlanIds, plans, form]);

  const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const cep = event.target.value.replace(/\D/g, '');
    form.setValue('cep', cep);

    if (cep.length === 8) {
      setIsFetchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          form.setValue('street', data.logouro);
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
    const result = await addStudent(data);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      setOpen(false);
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } else {
      toast({
        title: 'Erro ao cadastrar aluno!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar um novo aluno ao sistema.
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
                          className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                          )}
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
                              disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                              }
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
                        <Input
                          type="email"
                          placeholder="exemplo@email.com"
                          {...field}
                        />
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
                          className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                          )}
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
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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
                                          className={cn(
                                            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                                          )}
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
                            className={cn(
                                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                              )}
                            placeholder="00000-000"
                           />
                           {isFetchingCep && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <WaveSpinner className="h-5 w-5 text-primary" />
                            </div>
                           )}
                         </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rua das Flores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Apto 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Textarea
                          placeholder="Alergias, condições médicas, etc."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Matrícula Rápida em Turma (Opcional)</h3>
                 <FormField
                  control={form.control}
                  name="class_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turma</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={loadingData}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={loadingData ? "Carregando turmas..." : "Selecione uma turma"} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Plano e Pagamento Inicial (Opcional)</h3>
                 <FormField
                  control={form.control}
                  name="plan_ids"
                  render={() => (
                    <FormItem>
                        <FormLabel>Planos</FormLabel>
                         <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                            {plans.map((item) => (
                                <FormField
                                key={item.id}
                                control={form.control}
                                name="plan_ids"
                                render={({ field }) => {
                                    return (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...(field.value || []), item.id])
                                                : field.onChange(field.value?.filter((value) => value !== item.id))
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.name}</FormLabel>
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

                {(watchPlanIds && watchPlanIds.length > 0) && (
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="initial_payment_amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor a Pagar</FormLabel>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <FormControl>
                                        <Input className="pl-9" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="payment_method"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Método de Pagamento</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                )}
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {form.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar Aluno'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
