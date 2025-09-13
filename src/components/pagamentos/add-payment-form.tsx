
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
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { IMaskInput } from 'react-imask';
import { addTransaction, getPendingPayments } from '@/app/financeiro/actions';
import { getStudents } from '@/app/alunos/actions';
import type { Database } from '@/lib/database.types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Student = Database['public']['Tables']['students']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

const paymentFormSchema = z.object({
  student_id: z.string().min(1, 'É necessário selecionar um aluno.'),
  amount: z.string().min(1, 'O valor é obrigatório.'),
  payment_method: z.string({ required_error: 'Selecione um método de pagamento.' }),
  description: z.string().min(1, 'Selecione uma referência.'),
  due_date: z.date().default(new Date()),
  status: z.enum(['pago', 'pendente', 'vencido']).default('pago'),
  type: z.enum(['receita', 'despesa']).default('receita'),
  category: z.string().min(1, 'Selecione o tipo de cobrança.'),
  existing_payment_id: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const paymentMethods = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto'];
const chargeTypes = ['Mensalidade', 'Matrícula', 'Venda Avulsa', 'Outros'];
const months = Array.from({ length: 12 }, (_, i) => format(new Date(0, i), 'MMMM', { locale: ptBR }));


interface AddPaymentFormProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const formatCurrency = (value: number | null) => {
    if (value === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};


export function AddPaymentForm({ children, onSuccess }: AddPaymentFormProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [pendingPayments, setPendingPayments] = React.useState<Payment[]>([]);
  const [loadingStudents, setLoadingStudents] = React.useState(false);
  const [loadingPayments, setLoadingPayments] = React.useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: '',
      description: '',
      status: 'pago',
      type: 'receita',
      category: 'Mensalidade',
      due_date: new Date(),
    },
  });
  
  const studentId = form.watch('student_id');

  React.useEffect(() => {
    if (open) {
      setLoadingStudents(true);
      getStudents()
        .then(setStudents)
        .catch(() => toast({ title: 'Erro', description: 'Não foi possível carregar os alunos.', variant: 'destructive' }))
        .finally(() => setLoadingStudents(false));
    }
  }, [open, toast]);
  
  React.useEffect(() => {
    if (studentId) {
        setLoadingPayments(true);
        getPendingPayments(studentId)
            .then(setPendingPayments)
            .catch(() => toast({ title: 'Erro', description: 'Não foi possível buscar as pendências.', variant: 'destructive'}))
            .finally(() => setLoadingPayments(false));
    } else {
        setPendingPayments([]);
    }
  }, [studentId, toast]);

  const onSubmit = async (data: PaymentFormValues) => {
    const result = await addTransaction(data);
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
  
  const handlePendingPaymentSelect = (paymentId: string) => {
    const payment = pendingPayments.find(p => p.id === paymentId);
    if (payment) {
        form.setValue('existing_payment_id', payment.id);
        form.setValue('amount', String(payment.amount || '').replace('.', ','));
        const [category, description] = payment.description.split(' - ');
        form.setValue('category', category || 'Outros');
        form.setValue('description', description || '');
    }
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Novo Pagamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar um novo pagamento no sistema.
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
                  <Select
                    onValueChange={(value) => {
                        field.onChange(value);
                        form.resetField('existing_payment_id');
                        form.resetField('amount');
                    }}
                    defaultValue={field.value}
                    disabled={loadingStudents}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingStudents ? 'Carregando...' : 'Selecione o aluno...'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingStudents ? (
                        <SelectItem value="loading" disabled>
                          Carregando alunos...
                        </SelectItem>
                      ) : !students || students.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhum aluno cadastrado
                        </SelectItem>
                      ) : (
                        students.map((s) => (
                          <SelectItem key={String(s.id)} value={String(s.id)}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-cyan-100 text-cyan-700 text-xs">
                                  {getInitials(s.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{s.name}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {studentId && (
                <FormField
                    control={form.control}
                    name="existing_payment_id"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Cobranças Pendentes</FormLabel>
                        {loadingPayments ? <Loader2 className="h-5 w-5 animate-spin" /> :
                         pendingPayments.length > 0 ? (
                             <RadioGroup
                                onValueChange={handlePendingPaymentSelect}
                                className="gap-2"
                              >
                                {pendingPayments.map(p => (
                                    <FormItem key={p.id} className="flex items-center space-x-3 space-y-0 border p-3 rounded-md has-[:checked]:bg-accent">
                                        <FormControl>
                                            <RadioGroupItem value={p.id} />
                                        </FormControl>
                                        <FormLabel className="font-normal w-full flex justify-between items-center">
                                            <span>{p.description} - Vence em {format(new Date(p.due_date), 'dd/MM/yy')}</span>
                                            <span className="font-bold">{formatCurrency(p.amount)}</span>
                                        </FormLabel>
                                    </FormItem>
                                ))}
                             </RadioGroup>
                         ) : <p className="text-sm text-muted-foreground">Nenhuma cobrança pendente para este aluno.</p>
                        }
                        </FormItem>
                    )}
                />
            )}
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <IMaskInput
                      mask="R$ num"
                      blocks={{
                        num: { mask: Number, radix: ',', thousandsSeparator: '.', scale: 2, padFractionalZeros: true, normalizeZeros: true, mapToRadix: ['.'] },
                      }}
                      value={field.value || ''}
                      onAccept={(value) => field.onChange(value)}
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                      )}
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Cobrança</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chargeTypes.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referência</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((m) => (<SelectItem key={m} value={m}><span className="capitalize">{m}</span></SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
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
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Registrar Pagamento
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
