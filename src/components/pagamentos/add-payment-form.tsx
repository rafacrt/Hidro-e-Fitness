
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { IMaskInput } from 'react-imask';
import { addTransaction } from '@/app/financeiro/actions';

// ✅ novo import: hook padronizado de dados do formulário
import { useFormData } from '@/hooks/use-form-data';

const paymentFormSchema = z.object({
  student_id: z.string().min(1, 'É necessário selecionar um aluno.'),
  amount: z.string().min(1, 'O valor é obrigatório.'),
  payment_method: z.string({ required_error: 'Selecione um método de pagamento.' }),
  description: z.string().optional(),
  due_date: z.date().default(new Date()),
  status: z.enum(['pago', 'pendente', 'vencido']).default('pago'),
  type: z.enum(['receita', 'despesa']).default('receita'),
  category: z.string().default('Pagamentos Avulsos'),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const paymentMethods = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Boleto'];

interface AddPaymentFormProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddPaymentForm({ children, onSuccess }: AddPaymentFormProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  // 🔄 carrega alunos quando o modal abre, com autoLoad e controle de loading
  const { students, loading } = useFormData({
    fetchStudents: open,
    autoLoad: true,
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: '',
      description: '',
      status: 'pago',
      type: 'receita',
      category: 'Pagamentos Avulsos',
      due_date: new Date(),
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    const result = await addTransaction(data);
    if (result.success) {
      toast({
        title: 'Pagamento Registrado!',
        description: result.message,
      });
      setOpen(false);
      form.reset();
      onSuccess?.();
    } else {
      toast({
        title: 'Erro ao registrar pagamento!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Novo Pagamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar um novo pagamento no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Aluno com placeholder/itens de loading/empty e disabled durante fetch */}
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aluno</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading.students}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loading.students ? 'Carregando...' : 'Selecione o aluno...'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading.students ? (
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
                        num: {
                          mask: Number,
                          radix: ',',
                          thousandsSeparator: '.',
                          scale: 2,
                          padFractionalZeros: true,
                          normalizeZeros: true,
                          mapToRadix: ['.'],
                        },
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mensalidade de Janeiro" {...field} />
                  </FormControl>
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
